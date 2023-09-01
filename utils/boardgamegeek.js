
import fromXML from './xml2json'
//import {entities} from 'entities'

async function bggQuery(url, errTitle = "Error", errMsg = "Oops. Something went wrong") {
  try {
    const fullurl = "https://boardgamegeek.com/xmlapi2/" + url
    const results = await useFetch(fullurl)
    const gameData = results.data.value
    const asOBJ = fromXML(gameData)
    return asOBJ
  } catch (error) {
    console.error('BGG API Error: ', error)
    throw error
  }
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function mapGameObjects(gamesXML) {
  return gamesXML.map((game) => {
    const tags = game.link.filter((link) => {
      return link.type == "boardgamecategory" || link.type == "boardgamemechanic"
    }).map((link) => {
      return {
        id: link.id,
        name: link.value,
        type: link.type
      }
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
      rank = game.statistics.ratings.ranks.rank.find(rank => rank.id == "1").value
    } else {
      rank = game.statistics.ratings.ranks.rank.value
    }
    return {
      bgg_game_id: game.id,
      image: game.image,
      thumbnail: game.thumbnail,
      name,
      type: game.type,
      complexity: parseFloat(game.statistics.ratings.averageweight.value).toFixed(2),
      complexityVotes: game.statistics.ratings.numweights.value,
      rating: parseFloat(game.statistics.ratings.bayesaverage.value).toFixed(1),
      ratingVotes: game.statistics.ratings.usersrated.value,
      rank,
      minplayers: game.minplayers.value,
      maxplayers: game.maxplayers.value,
      minplaytime: game.minplaytime.value,
      maxplaytime: game.maxplaytime.value,
      minage: game.minage.value,
      publishyear: parseInt(game.yearpublished.value),
      description: htmlDecode(game.description),
      tags
    }
  })
}

export default {
  // TODO: could be a max number of games in one query, might need to do batches
  async getGameInfo(gameIds) {
    const strung = gameIds.join()
    const url = `thing?id=${strung}&stats=1`
    const results = await bggQuery(url)
    const gamesXML = Array.isArray(results.items.item) ? results.items.item : [results.items.item]
    return mapGameObjects(gamesXML)
  },

  async gameSearch(query, exact = false) {
    let url = `search?query=${query}&type=boardgame&exact=${exact? '1' : '0'}`
    let results = await bggQuery(url)
    if (!('item' in results.items)) return []
    let games = Array.isArray(results.items.item) ? results.items.item : [results.items.item]

    games = games.filter(game => game.name.type == "primary")


    let idString = games.map(x => x.id)
    url = `thing?id=${idString}&stats=1`
    results = await bggQuery(url)
    games = Array.isArray(results.items.item) ? results.items.item : [results.items.item]
    return mapGameObjects(games)
  },

  async getCollection(username){
    let url = `collection?username=${username}&own=1`
    try {
      const results = await bggQuery(url)
      const gameIds = results.items.item.map((game) => { return game.objectid })
      const allGameInfo = this.getGameInfo(gameIds)
      return allGameInfo
    } catch(error) {      
      console.error('BGG Failed to get Collection')
      throw error
    }
  }

}