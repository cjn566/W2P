
import { validTagTypes, getGameInfo } from '~/utils/boardgamegeek'
import { makeArray } from '~/utils/makearray'
// import { useToast } from 'primevue/usetoast'
// const toast = useToast()

export const gamesReady = ref(false)

export const games = ref([])

export async function fetchGames(userGames) {
  gamesReady.value = false
  const gameData = await getGameInfo(userGames.map((game) => game.bgg_game_id))
  games.value = gameData.map((g) => {
    g.userGameId = userGames.find((x) => x.bgg_game_id == g.bgg_game_id).id
    return g
  })
  extendGames()
}

export async function addGames(newGames) {
  gamesReady.value = false
  newGames = makeArray(newGames)
  const gameIDs = newGames.map(x => x.bgg_game_id)
  const res = (await useFetch('/api/collection/add',
    {
      method: 'post',
      body: gameIDs
    })).data.value
  res.forEach((r) => {
    if (r.err && r.msg == "duplicate") {
      // toast.add({ severity: 'error', summary: 'Cannot add that game', detail: 'That game was already in your library', life: 3000 })
    } else {
      let g = newGames.find(x => x.bgg_game_id == r.bgg_game_id)
      g.owns = true
      g.id = r.newID
      games.value.unshift(g)
      // toast.add({ severity: 'success', summary: `${g.name} was added to your library.`, life: 3000 })
    }
  })
  extendGames()

}

// removeGames,

function extendGames() {
  games.value = games.value.map((g)=>{    
    g.ownedExpansions = []
    g.isExpansionFor = []
    g.filters = {
      tags: {},
      passesAnyTag: false,
      passesAllTags: false,
      sliders: {
          allTags: true,
          complexity: true,
          playersMin: true,
          playersMax: true,
          playtimeMin: true,
          playtimeMax: true,
          age: true,
          year: true
      },
      passesAllSliders: true
    }
    return g
  })
  games.value.filter(g => g.type === "boardgameexpansion").forEach((expansion) => {
    expansion.canExpandGameId.forEach((gid) => {
      const baseGame = games.value.find(game => game.bgg_game_id === gid)
      if (baseGame) {
        baseGame.ownedExpansions.push(expansion)
        expansion.isExpansionFor.push(baseGame)
      }
    })
  })
  gamesReady.value = true
}

export const dev_expGames = computed(()=>{
  return games.value.filter((g) => {  return g.ownedExpansions?.length || g.isExpansionFor?.length })
  .map((g) => { return {
    name: g.name,
    ownedExpansions: g.ownedExpansions,
    isExpansionFor: g.isExpansionFor
  }})
})

// export function tagList(gameList) {
//   const tags = {}

//   gameList.forEach((g) => {
//       for(const linkId in g.tags){
//         if (tags.hasOwnProperty(linkId)) {
//           tags[linkId].members.push(g.userGameId)
//         } else {
//           tags[type][linkId] = {
//             name: g[type][linkId].value,
//             members: [g.userGameId]
//           }
//         }
//       })
//   })

//   for (const type in tags) {
//     const arr = []
//     for (const id in tags[type]) {
//       arr.push({
//         id,
//         name: tags[type][id].name,
//         members: tags[type][id].members
//       })
//     }
//     tags[type] = arr
//     tags[type].sort((a, b) => {
//       return b.members.length - a.members.length
//     })
//   }

//   return tags
// }
