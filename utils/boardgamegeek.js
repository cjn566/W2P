
import fromXML from './xml2json'
import makeArray from './makearray'

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
    
const validTagTypes = ['boardgamecategory', 'boardgamemechanic', 'boardgameexpansion', 'boardgamefamily']

function makeArray(x) {
  if (!Array.isArray(x)) {
          x = [x]
      }
      return x
  }

function mapGameObjects(gamesXML) {
  return gamesXML.map((game) => {
    game.link = makeArray(game.link)

    const tags = game.link.filter((link) => {
      return validTagTypes.includes(link.type)
    })

    let name
    if (Array.isArray(game.name)) {
      name = game.name.find(name => name.type == 'primary').value
    } else {
      name = game.name.value
    }

    let rank
    if (Array.isArray(game.statistics.ratings.ranks.rank)) {
      // Only take the "Board Game Rank" (rank type id = 1)
      rank = parseInt(game.statistics.ratings.ranks.rank.find(rank => rank.id == "1").value)
    } else {
      rank = parseInt(game.statistics.ratings.ranks.rank.value)
    }
    return {
      bgg_game_id: game.id,
      image: game.image,
      thumbnail: game.thumbnail,
      name,
      type: game.type,
      complexity: Number(parseFloat(game.statistics.ratings.averageweight.value).toFixed(1)),
      complexityVotes: game.statistics.ratings.numweights.value,
      rating: Number(parseFloat(game.statistics.ratings.bayesaverage.value).toFixed(1)),
      ratingVotes: parseInt(game.statistics.ratings.usersrated.value),
      rank,
      players: {
        min: parseInt(game.minplayers.value),
        max: parseInt(game.maxplayers.value)
      },
      playtime: {
        min: parseInt(game.minplaytime.value),
        max: parseInt(game.maxplaytime.value)
      },
      age: parseInt(game.minage.value),
      publishyear: parseInt(game.yearpublished.value),
      description: htmlDecode(game.description),
      tags,
      ownedExpansions: [],
      isExpansionFor: []
    }
  })
}

// TODO: could be a max number of games in one query, might need to do batches
async function getGameInfo(gameIds) {
  const strung = gameIds.join()
  const url = `thing?id=${strung}&stats=1`
  const results = await bggQuery(url)
  const gamesXML = makeArray(results.items.item)
  return mapGameObjects(gamesXML)
}

export default {
  validTagTypes,
  getGameInfo,  

  async gameSearch(query, exact = false) {
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
    games.sort((a,b)=>{
      return b.ratingVotes - a.ratingVotes
    })
    return games
  },

  async getCollection(username) {
    let url = `collection?username=${username}&own=1`
    try {
      const results = await bggQuery(url)
      const gameIds = results.items.item.map((game) => { return game.objectid })
      const allGameInfo = this.getGameInfo(gameIds)
      return allGameInfo
    } catch (error) {
      console.warn('Failed to get this BGG collection, likely the username does not exist.')
      throw error
    }
  }

}