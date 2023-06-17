
import fromXML from './xml2json'
//import {entities} from 'entities'

async function bggQuery (url, errTitle = "Error", errMsg = "Oops. Something went wrong") {
  try {
    const fullurl = "https://boardgamegeek.com/xmlapi2/" + url
    const results = await useFetch(fullurl)
    const gameData = results.data.value
    const asOBJ = fromXML(gameData)
    return asOBJ
  } catch (error) {
    console.error('tryGet: ', error)
    return null
  }
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function mapGameObjects(uglyGames) {
  return uglyGames.map((game) => {
    const tags = game.link.filter((link) => {
        return link.type == "boardgamecategory" || link.type == "boardgamemechanic"
      }).map((link)=>{
          return {
          id: link.id,
          name: link.value
          }
      })
    if(Array.isArray(game.name)){
      game.name = game.name[0]
    }
    return {
        id: game.id,
        image: game.image,
        thumbnail: game.thumbnail,
        name: game.name.value,
        complexity: parseFloat(game.statistics.ratings.averageweight.value).toFixed(2),
        complexityVotes: game.statistics.ratings.numweights.value,
        rating: parseFloat(game.statistics.ratings.average.value).toFixed(1),
        ratingVotes: game.statistics.ratings.usersrated.value,
        rank: game.statistics.ratings.ranks.rank.value,
        minplayers: game.minplayers.value,
        maxplayers: game.maxplayers.value,
        minplaytime: game.minplaytime.value,
        maxplaytime: game.maxplaytime.value,
        minage: game.minage.value,
        publishyear: game.yearpublished.value,
        //description: htmlDecode(game.description),
        description: htmlDecode(game.description),
        tags
    }
  })
}
      
export default {
  async getGameInfo (gameIds) {
    const strung = gameIds.join()
    const url = `thing?id=${strung}&stats=1`
    const results = await bggQuery(url)
    const prettyGames = mapGameObjects(results.items.item)
    return prettyGames
  }
  
}