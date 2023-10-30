
import bgg from '~/utils/boardgamegeek'
import makeArray from '~/utils/makearray'
// import { useToast } from 'primevue/usetoast'
// const toast = useToast()

const games = ref([])

async function fetchGames(userGames) {
  const gameData = await bgg.getGameInfo(userGames.map((game) => game.bgg_game_id))
  games.value = gameData.map((g) => {
    g.userGameId = userGames.find((x) => x.bgg_game_id == g.bgg_game_id).id
    return g
  })
  mapExpansions()
}

async function addGames(games) {
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
    let basegameTags = expansion.tags.filter(t => t.type === "boardgameexpansion" && t.inbound)
    basegameTags.forEach((tag) => {
      const baseGame = games.value.find(game => game.bgg_game_id === tag.id)
      if (baseGame) {
        baseGame.ownedExpansions.push(expansion.userGameId)
        expansion.isExpansionFor.push(baseGame.userGameId)
      }
    })
  })
}

const dev_expGames = computed(()=>{
   games.value.filter((g) => {  return g.expansions.length || g.isExpansionFor.length })
})

const tags = computed(() => {
  const tags = {}
  for (const key of bgg.validTagTypes) {
    tags[key] = {}
  }

  games.value.map((g) => {
    g.tags.map((t) => {
      if (tags[t.type].hasOwnProperty(t.id)) {
        tags[t.type][t.id].count++
      } else {
        tags[t.type][t.id] = {
          value: t.value,
          count: 1
        }
      }
    })
  })

  for (const type in tags) {
    const arr = []
    for (const id in tags[type]) {
      arr.push({
        id,
        value: tags[type][id].value,
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

export default {
  addGames,
  games,
  dev_expGames,
  fetchGames,
  tags
}