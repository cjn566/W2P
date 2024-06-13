
import { validTagTypes, getGameInfo } from '~/utils/boardgamegeek'
import { makeArray } from '~/utils/makearray'
// import { useToast } from 'primevue/usetoast'
// const toast = useToast()

export function getGameURL(id) {
  return `https://boardgamegeek.com/boardgame/${id}`
}

export const user = ref({})

export const status = ref({
  user: 'unset',
  gamesReady: false
})

export const games = ref([])

export async function setUser(slug) {
  if (user.value.slug == slug) return
  const res = (await useFetch(`/api/user/${slug}`)).data.value
  // TODO: handle errors, set status on user
  if (res.err_code) {
    // toast.add({ severity: 'error', summary: 'Error', detail: 'Could not find that user', life: 3000 })
    return
  }
  user.value = res
  // Fetch the user's games
  if (res.games.length == 0) {
    status.value.gamesReady = true
    return
  }
  status.value.gamesReady = false
  const gameData = await getGameInfo(res.games.map((game) => game.bgg_game_id))
  games.value = gameData.map((g) => {
    g.userGameId = res.games.find((x) => x.bgg_game_id == g.bgg_game_id).id
    return g
  })
  extendGames()
}

export async function addGames(newGames) {
  status.value.gamesReady = false
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

export const indices = ref()
export var limits = {}

// removeGames,

function extendGames() {
  games.value = games.value.map((g) => {
    g.ownedExpansions = []
    g.isExpansionFor = []
    g.filters = {
      tags: {},
      passesAnyTag: false,
      passesAllTags: false,
      sliders: {
        complexity: [
          true,
          true
        ],
        players: [
          true,
          true
        ],
        playtime: [
          true,
          true
        ],
        age: [
          true,
          true
        ],
        year: [
          true,
          true
        ]
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

  limits = makeLimits()
  indices.value = makeIndices()

  status.value.gamesReady = true
}

export const dev_expGames = computed(() => {
  return games.value.filter((g) => { return g.ownedExpansions?.length || g.isExpansionFor?.length })
    .map((g) => {
      return {
        name: g.name,
        ownedExpansions: g.ownedExpansions,
        isExpansionFor: g.isExpansionFor
      }
    })
})


// Makes an ascending sorted array 
function makeIndex(minKey, maxKey = null) {
  const minSorted = games.value.map((game) => [game.filters, game[minKey]]).sort((a, b) => (a[1] - b[1]))
  return {
    sorted: [
      minSorted,
      maxKey ?
        games.value.map((game) => [game.filters, game[maxKey]]).sort((a, b) => (a[1] - b[1]))
        : minSorted
    ],
    current: [
      {
        value: null,
        index: null
      },
      {
        value: null,
        index: null
      }
    ]
  }
}

function makeLimits() {
  return games.value.reduce((limits, game) => {
    if (game.complexity > 0.1) {
      limits.complexity[0] = Math.min(limits.complexity[0], game.complexity)
      limits.complexity[1] = Math.max(limits.complexity[1], game.complexity)
    }
    if (game.playersMin > 0) {
      limits.players[0] = Math.min(limits.players[0], game.playersMin)
    }
    limits.players[1] = Math.max(limits.players[1], game.playersMax)
    if (game.playtimeMin > 0) {
      limits.playtime[0] = Math.min(limits.playtime[0], game.playtimeMin)
    }
    limits.playtime[1] = Math.max(limits.playtime[1], game.playtimeMax)
    if (game.age > 0) {
      limits.age[0] = Math.min(limits.age[0], game.age)
      limits.age[1] = Math.max(limits.age[1], game.age)
    }
    if (game.year > 0) {
      limits.year[0] = Math.min(limits.year[0], game.year)
      limits.year[1] = Math.max(limits.year[1], game.year)
    }
    return limits
  },
    {
      complexity: [
        50,
        -1
      ],
      players: [
        12,
        -1
      ],
      playtime: [
        1000,
        -1
      ],
      age: [
        100,
        -1
      ],

      year: [
        5000,
        -1
      ]
    })
}



function makeIndices() {
  let ret = {
    complexity: makeIndex('complexity'),
    players: makeIndex('playersMax', 'playersMin'),
    playtime: makeIndex('playtimeMax', 'playtimeMin'),
    age: makeIndex('age'),
    year: makeIndex('year')
  }
  ret.complexity.current[0].value = limits.complexity[0]
  ret.complexity.current[1].value = limits.complexity[1]
  ret.players.current[0].value = limits.players[0]
  ret.players.current[1].value = limits.players[1]
  ret.playtime.current[0].value = limits.playtime[0]
  ret.playtime.current[1].value = limits.playtime[1]
  ret.age.current[0].value = limits.age[0]
  ret.age.current[1].value = limits.age[1]
  ret.year.current[0].value = limits.year[0]
  ret.year.current[1].value = limits.year[1]

  return ret
}




export function commitSliderValues(prop, newValues) {
  let foo = indices.value[prop]
  for (let ltgt = 0; ltgt < 2; ltgt++) {
    let prevIdx = foo.current[ltgt].index ?? (ltgt ? foo.sorted[ltgt].length - 1 : 0)
    let newIdx
    if (ltgt) {
      newIdx = foo.sorted[ltgt].findLastIndex(g => newValues[ltgt] >= g[1])
    } else {
      newIdx = foo.sorted[ltgt].findIndex(g => newValues[ltgt] <= g[1])
    }
    foo.current[ltgt].value = newValues[ltgt]
    foo.current[ltgt].index = newIdx
    let toggleCount = prevIdx - newIdx
    if (!toggleCount) continue
    let begin = 0, end = 0, toggle = true
    if (toggleCount > 0) {
      begin = newIdx + ltgt
      end = prevIdx + ltgt
      toggle = ltgt === 0
    } else {
      begin = prevIdx + ltgt
      end = newIdx + ltgt
      toggle = ltgt === 1
    }
    foo.sorted[ltgt].slice(begin, end).forEach(bar => {
      bar[0].sliders[prop][ltgt] = toggle
      bar[0].passesAllSliders = !Object.entries(bar[0].sliders).some(x => !x[1][0] || !x[1][1])
    })
  }
}

export const filteredTags = ref([])

export const searchTerm = ref('')

export const filteredGames = computed(() => {
  let ret = games.value

  if (searchTerm.value.trim().length > 1) {
    ret = ret.filter(g => g.searchName.includes(searchTerm.value.trim()))
  }

  let checkingTags = filteredTags.value.length > 0
  ret = ret.filter(g =>
    g.filters.passesAllSliders &&
    (checkingTags ? g.filters.passesAllTags : true)
  )


  switch (sorting.value.active) {
    case 'players':
      if (!sorting.value.descending) {
        ret = ret.sort((a, b) => { return a.playersMin - b.playersMin + ((a.playersMax - b.playersMax) / 1000) })
      } else {
        ret = ret.sort((a, b) => { return b.playersMax - a.playersMax + ((b.playersMin - a.playersMin) / 1000) })
      }
      break
    case 'playtime':
      if (!sorting.value.descending) {
        ret = ret.sort((a, b) => { return a.playtimeMin - b.playtimeMin + ((a.playtimeMax - b.playtimeMax) / 1000) })
      } else {
        ret = ret.sort((a, b) => { return b.playtimeMax - a.playtimeMax + ((b.playtimeMin - a.playtimeMin) / 1000) })
      }
      break
    case 'name':
      ret = ret.sort((a, b) => {
        return b.name.localeCompare(a.name) * (sorting.value.descending ? -1 : 1)
      })
      break
    default:
      ret = ret.sort((a, b) => {
        return (a[sorting.value.active] - b[sorting.value.active]) * (sorting.value.descending ? -1 : 1)
      })
      break
  }

  return ret
})

export const sorting = ref({
  descending: false,
  active: 'name'
  // name
  // rating
  // complexity
  // players
  // playtime
  // age
  // year
})

export function sortBy(prop) {
  let descending = true

  if (sorting.value.active == prop) {
    descending = !sorting.value.descending
  }

  sorting.value.active = prop
  sorting.value.descending = descending
}
