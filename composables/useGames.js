
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
  mapExpansions()
}

export async function addGames(games) {
  gamesReady.value = false
  games = makeArray(games)
  const gameIDs = games.value.map(x => x.bgg_game_id)
  const res = (await useFetch('/api/collection/add',
    {
      method: 'post',
      body: gameIDs
    })).data.value
  res.forEach((r) => {
    if (r.err && r.msg == "duplicate") {
      toast.add({ severity: 'error', summary: 'Cannot add that game', detail: 'That game was already in your library', life: 3000 })
    } else {
      let g = games.value.find(x => x.bgg_game_id == r.bgg_game_id)
      g.owns = true
      g.id = r.newID
      games.value.unshift(g)
      toast.add({ severity: 'success', summary: `${g.name} was added to your library.`, life: 3000 })
    }
  })
  mapExpansions()

}

// removeGames,

function mapExpansions() {
  games.value = games.value.map((g)=>{    
    g.ownedExpansions = []
    g.isExpansionFor = []
    return g
  })
  const exps = games.value.filter(g => g.type === "boardgameexpansion")
  exps.forEach((expansion) => {
    expansion.canExpandGameId.forEach((gid) => {
      const baseGame = games.value.find(game => game.bgg_game_id === gid)
      if (baseGame) {
        baseGame.ownedExpansions.push(expansion.userGameId)
        expansion.isExpansionFor.push(baseGame.userGameId)
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

export const tags = computed(() => {
  const tags = {}
  for (const key of validTagTypes) {
    tags[key] = {}
  }

  games.value.forEach((g) => {
    validTagTypes.forEach((type) => {
      for(const linkId in g[type]){
        if (tags[type].hasOwnProperty(linkId)) {
          tags[type][linkId].count++
        } else {
          tags[type][linkId] = {
            name: g[type][linkId].value,
            count: 1
          }
        }
      }
    })
  })

  for (const type in tags) {
    const arr = []
    for (const id in tags[type]) {
      arr.push({
        id,
        name: tags[type][id].name,
        count: tags[type][id].count
      })
    }
    tags[type] = arr
    tags[type].sort((a, b) => {
      return b.count - a.count
    })
  }

  return tags
})
