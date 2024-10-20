import query from '../db'
import fromXML from './xml2json'
import { makeArray } from './makearray'
import { pino } from 'pino'
const logger = pino({ name: 'bgg' })

async function bggQuery(url) {
  try {
    const fullurl = "https://boardgamegeek.com/xmlapi2/" + url
    const res = await $fetch(fullurl)
    return fromXML(res)
  } catch (error) {
    console.log('BGG API Error: ', error)
    throw error
  }
}

export const validTagTypes = ['boardgamecategory', 'boardgamemechanic']

function mapGameObjects(gamesXML) {
  return gamesXML.reduce((obj, game) => {

    // Only take the primary name
    let name
    if (Array.isArray(game.name)) {
      name = game.name.find(name => name.type == 'primary').value
    } else {
      name = game.name.value
    }

    // Only take the "Board Game Rank" (rank type id = 1)
    let rank
    if (Array.isArray(game.statistics.ratings.ranks.rank)) {
      rank = parseInt(game.statistics.ratings.ranks.rank.find(rank => rank.id == "1").value)
    } else {
      rank = parseInt(game.statistics.ratings.ranks.rank?.value)
    }

    let cv = parseInt(game.statistics.ratings.numweights.value)
    let rv = parseInt(game.statistics.ratings.usersrated.value)

    // Game Object
    const ret = {
      bgg_game_id: game.id,
      image: game.image,
      thumbnail: game.thumbnail,
      name,
      searchName: name.toLowerCase(),
      type: game.type,
      complexity: cv > 30 ? Number(parseFloat(game.statistics.ratings.averageweight.value).toFixed(1)) : 0,
      // complexityVotes: parseInt(game.statistics.ratings.numweights.value),
      rating: rv > 30 ? Number(parseFloat(game.statistics.ratings.average.value).toFixed(1)) : 0,
      ratingVotes: rv,
      rank,
      playersMin: parseInt(game.minplayers.value),
      playersMax: parseInt(game.maxplayers.value),
      playtimeMin: parseInt(game.minplaytime.value),
      playtimeMax: parseInt(game.maxplaytime.value),
      age: parseInt(game.minage.value),
      year: parseInt(game.yearpublished.value),
      description: game.description,
      tags: {}
    }

    ret.display = {
      rating: ret.rating > 0.1 ? '' + ret.rating : '-',
      complexity: ret.complexity > 0.1 ? '' + ret.complexity : '-',
      players: ret.playersMin == ret.playersMax ? ret.playersMin : `${ret.playersMin} - ${ret.playersMax}`,
      playtime: ret.playtimeMin ? (ret.playtimeMin == ret.playtimeMax ? ret.playtimeMin + '' : `${ret.playtimeMin} - ${ret.playtimeMax}`) : '-',
      age: ret.age ? ret.age + '' : '-',
      year: ret.year ? '' + ret.year : '-'
    }


    // Tags / links
    game.link = makeArray(game.link)
    game.link.forEach((link) => {
      if (validTagTypes.includes(link.type)) {
        ret.tags[link.id] = link.value
      }
    })

    if (game.type === 'boardgameexpansion') {
      ret.canExpandGameId = game.link.filter(t => t.type === "boardgameexpansion" && t.inbound).map(t => t.id)
    }

    obj[ret.bgg_game_id] = ret
    return obj
  }, {})
}


export async function getGameInfo(gameIds) {

  // Check if the DB has a recent version of the game data
  let age = process.env.CACHE_GAME_AGE_DAYS || 7
  let redis = await query(`SELECT bgg_game_id, data FROM app.bgg_game_data WHERE bgg_game_id =ANY($1) AND modified_timestamp > now() - interval '${age} day'`, [gameIds])

  let DBGames = {}, APIGames = {}
  if (redis.rowCount > 0) {
    DBGames = redis.rows.reduce((obj, g) => {
      obj[g.bgg_game_id] = g.data
      return obj
    }, DBGames)
  }

  // Get IDs of games that need to be fetched from the API
  gameIds = gameIds.filter((gameId) => DBGames[gameId] === undefined)

  if (gameIds.length > 0) {
    // API only handles 20 at a time, so break it into chunks
    const chunkSize = 20
    let reqs = []
    for (let i = 0; i < gameIds.length; i += chunkSize) {
      const chunk = gameIds.slice(i, i + chunkSize);
      const url = `thing?id=${chunk.join()}&stats=1`
      reqs.push(bggQuery(url))
    }

    let responses
    try {
      let start = Date.now()
      responses = await Promise.all(reqs)
      console.info('BGG API fetch took', Date.now() - start)

      // Take the chunks of 20 XML responses and process them into an array of game objects
      APIGames = mapGameObjects(makeArray(responses).map(x => x.items.item).flat())

      // For any games that were fetched from the API, save them to the DB
      let saveGames = []
      for (let id in APIGames) {
        saveGames.push(
          query("INSERT INTO app.bgg_game_data (bgg_game_id, data) VALUES ($1, $2) ON CONFLICT (bgg_game_id) DO UPDATE SET data = $2", [id, APIGames[id]])
        )
      }

      try {
        Promise.all(saveGames)
        console.info('Saved ' + saveGames.length + ' games to DB', { games: saveGames.length })
      } catch (error) {
        console.log('Save Games Error: ', error)
      }
    } catch (error) {
      console.log('BGG API Error: ', error)
    }
  }

  console.info(`loaded ${Object.keys(DBGames).length} games from DB and ${Object.keys(APIGames).length} games from API`, { DBGames: Object.keys(DBGames).length, APIGames: Object.keys(APIGames).length })

  // Combine the DB and API games and return them
  return { ...APIGames, ...DBGames }
}

// When a user is searching for games to add to their collecction.
export async function gameSearch(query, type = 'boardgame', exact = false, limit = 10) {

  console.info('gameSearch', { query, type, exact, limit })

  // Search using API
  let initialResults = await bggQuery(`search?query=${query}&type=${type}&exact=${exact ? '1' : '0'}`)

  // If no results, return empty array
  if (!('item' in initialResults.items)) return []


  // Get game info for the search results, taking only the first 'limit' results with primary name
  // TODO: cut into chunks of 20 and repeat until 'limit' results are achieved


  return Object.values( (await getGameInfo(
    makeArray(initialResults.items.item)
      .filter(game => game.name.type == "primary")
      .slice(0, limit)
      .map(x => x.id)
  )) ).filter((game) => game.type == type)
}

export async function getCollection(username) {
  let url = `collection?username=${username}&own=1`
  try {
    const results = await bggQuery(url)
    const gameIds = results.items.item.map((game) => { return game.objectid })
    const allGameInfo = getGameInfo(gameIds)
    return allGameInfo
  } catch (error) {
    console.log('Failed to get this BGG collection, likely the username does not exist.')
    throw error
  }
}

