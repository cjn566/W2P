
import fromXML from './xml2json'
import { makeArray } from './makearray'

async function bggQuery(url, errTitle = "Error", errMsg = "Oops. Something went wrong") {
  try {
    const fullurl = "https://boardgamegeek.com/xmlapi2/" + url
    const { data, error } = await useFetch(fullurl)
    if (error.value) throw { message: 'BGG API Error: ', error }
    return fromXML(data.value)
  } catch (error) {
    console.warn('BGG API Error: ', error)
    throw error
  }
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

export const validTagTypes = ['boardgamecategory', 'boardgamemechanic']

function mapGameObjects(gamesXML) {
  return gamesXML.map((game) => {

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
      rank = parseInt(game.statistics.ratings.ranks.rank.value)
    }

    let cv = parseInt(game.statistics.ratings.numweights.value)
    let rv = parseInt(game.statistics.ratings.usersrated.value)

    // Game Object
    const ret = {
      bgg_game_id: game.id,
      image: game.image,
      thumbnail: game.thumbnail,
      name,
      type: game.type,
      complexity: cv > 30? Number(parseFloat(game.statistics.ratings.averageweight.value).toFixed(1)) : 0,
      // complexityVotes: parseInt(game.statistics.ratings.numweights.value),
      rating: rv > 30? Number(parseFloat(game.statistics.ratings.bayesaverage.value).toFixed(1)) : 0,
      // ratingVotes: parseInt(game.statistics.ratings.usersrated.value),
      rank,
      playersMin:parseInt(game.minplayers.value),
      playersMax: parseInt(game.maxplayers.value),
      playtimeMin: parseInt(game.minplaytime.value),
      playtimeMax: parseInt(game.maxplaytime.value),
      age: parseInt(game.minage.value),
      year: parseInt(game.yearpublished.value),
      description: htmlDecode(game.description),
      tags: {}
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

    return ret
  })
}

// TODO: could be a max number of games in one query, might need to do batches
export async function getGameInfo(gameIds) {
  let allGames = JSON.parse(localStorage.getItem('allGames'))
  if(!allGames){
    const results = await bggQuery(`thing?id=${gameIds.join()}&stats=1`)
    allGames = mapGameObjects(makeArray(results.items.item))
    localStorage.setItem('allGames', JSON.stringify(allGames))
  }
  return allGames
}

export async function gameSearch(query, exact = false) {
  let url = `search?query=${query}&type=boardgame&exact=${exact ? '1' : '0'}`
  let results = await bggQuery(url)
  if (!('item' in results.items)) return []
  let games = makeArray(results.items.item)
  games = games.filter(game => game.name.type == "primary")
  let idString = games.map(x => x.id)
  url = `thing?id=${idString}&stats=1`
  results = await bggQuery(url)
  games = makeArray(results.items.item)
  games = mapGameObjects(games)
  games.sort((a, b) => {
    return b.ratingVotes - a.ratingVotes
  })
  return games
}

export async function getCollection(username) {
  let url = `collection?username=${username}&own=1`
  try {
    const results = await bggQuery(url)
    const gameIds = results.items.item.map((game) => { return game.objectid })
    const allGameInfo = getGameInfo(gameIds)
    return allGameInfo
  } catch (error) {
    console.warn('Failed to get this BGG collection, likely the username does not exist.')
    throw error
  }
}