
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

export async function removeGames(deadGames) {
  status.value.gamesReady = false
  deadGames = makeArray(deadGames)
  const gameIDs = deadGames.map(x => x.userGameId)
  const res = (await useFetch('/api/collection/remove',
    {
      method: 'post',
      body: gameIDs
    })).data.value
  res.forEach((r) => {
    games.value = games.value.filter(game => game.userGameId !== r.userGameId)
    // toast.add({ severity: 'success', summary: `${g.name} was added to your library.`, life: 3000 })
  })
  extendGames()
}


export var limits = {}

const indices = ref({})

// removeGames,

function extendGames() {
  games.value = games.value.map((g) => {
    g.selected = false
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

  limits = games.value.reduce((limits, game) => {
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


  

  indices.value = makeIndices()

  buildTagList()

  status.value.gamesReady = true
}

export const filters = computed(() => {
  return Object.fromEntries(Object.entries(indices.value).map(([k, v]) => [k, 
    {
      active: v.current[0].index !== null || v.current[1].index !== null,
      values: [
        v.current[0].index === null ? null : v.current[0].value,
        v.current[1].index === null ? null : v.current[1].value
      ]
    }
  ]));
})



// array the size of steps in the range, element is [value, game count]

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
  if (newValues === null) { // Clear all, set to limits and indices to null
    indices.value[prop].current[0].index = null
    indices.value[prop].current[0].value = limits[prop][0]

    indices.value[prop].current[1].index = null
    indices.value[prop].current[1].value = limits[prop][1]
    
    games.value.forEach(game => {
      game.filters.sliders[prop][0] = true
      game.filters.sliders[prop][1] = true
      game.filters.passesAllSliders = !Object.entries(game.filters.sliders).some(x => !x[1][0] || !x[1][1])
    })
  } else {
    let propSet = indices.value[prop]
    let clearSide = false

    // First process less than, then greater than
    for (let ltgt = 0; ltgt < 2; ltgt++) {

      // If the value is the same, skip
      if(newValues[ltgt] === propSet.current[ltgt].value) continue

      // If the value is null, that side is cleared. Set value to limit, process games, then set index to null
      if(newValues[ltgt] === null){
        newValues[ltgt] = limits[prop][ltgt]
        clearSide = true
      }

      // Get the previous index. If it's null, set to the end or beginning
      let prevIdx = propSet.current[ltgt].index ?? (ltgt ? propSet.sorted[ltgt].length - 1 : 0)
      let newIdx

      // Find the new index out of the sorted array. If it's being reset, it will be the first or last
      if (ltgt) {
        newIdx = clearSide ? (propSet.sorted[ltgt].length - 1) : propSet.sorted[ltgt].findLastIndex(g => newValues[ltgt] >= g[1])
      } else {
        newIdx = clearSide ? 0 : propSet.sorted[ltgt].findIndex(g => newValues[ltgt] <= g[1])
      }

      // Set the new value and index. If it's being reset, the index is null
      propSet.current[ltgt].value = newValues[ltgt]
      propSet.current[ltgt].index = clearSide ? null : newIdx

      // Compute how many games need to be toggled
      let toggleCount = prevIdx - newIdx

      // If no games, then skip
      if (!toggleCount) continue

      let begin = 0, end = 0, toggle = true
      // If moving left vs right, the begin and end are swapped
      // and set whether games now pass or fail the filter
      if (toggleCount > 0) {
        begin = newIdx + ltgt
        end = prevIdx + ltgt
        toggle = ltgt === 0
      } else {
        begin = prevIdx + ltgt
        end = newIdx + ltgt
        toggle = ltgt === 1
      }

      // Process through the games and set the pass state for the filter,
      // then check if the game passes all filters
      propSet.sorted[ltgt].slice(begin, end).forEach(bar => {
        bar[0].sliders[prop][ltgt] = toggle
        bar[0].passesAllSliders = !Object.entries(bar[0].sliders).some(x => !x[1][0] || !x[1][1])
      })
    }
  }
}

export const filteredTags = ref([])

export const searchTerm = ref('')

export const editingGames = ref(false)

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




  return ret
})

export const sorting = ref({
  descending: true,
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

  switch (prop) {
    case 'players':
      if (descending) {
        games.value = games.value.sort((a, b) => { return a.playersMin - b.playersMin + ((a.playersMax - b.playersMax) / 1000) })
      } else {
        games.value = games.value.sort((a, b) => { return b.playersMax - a.playersMax + ((b.playersMin - a.playersMin) / 1000) })
      }
      break
    case 'playtime':
      if (!sorting.value.descending) {
        games.value = games.value.sort((a, b) => { return a.playtimeMin - b.playtimeMin + ((a.playtimeMax - b.playtimeMax) / 1000) })
      } else {
        games.value = games.value.sort((a, b) => { return b.playtimeMax - a.playtimeMax + ((b.playtimeMin - a.playtimeMin) / 1000) })
      }
      break
    case 'name':
      games.value = games.value.sort((a, b) => {
        return b.name.localeCompare(a.name) * (sorting.value.descending ? -1 : 1)
      })
      break
    default:
      games.value = games.value.sort((a, b) => {
        return (a[sorting.value.active] - b[sorting.value.active]) * (sorting.value.descending ? -1 : 1)
      })
      break
  }
}

export function clearAllTags() {
  filteredTags.value.forEach(tag => {
    tag.filterActive = false
    for (const game of tag.members) {
      game.filters.tags[tag.id] = false
      game.filters.passesAnyTag = false
      game.filters.passesAllTags = true
    }
  })
  filteredTags.value = []
}

export function clickedTag(tag) {
  let tagIdx = filteredTags.value.indexOf(tag)
  let added = tagIdx === -1
  if (added) {
      tag.filterActive = true
      filteredTags.value.push(tag)
  } else {
      tag.filterActive = false
      filteredTags.value.splice(tagIdx, 1)
  }

  let numCurrentTags = filteredTags.value.length
  let checkAllGames = numCurrentTags > 1 || (numCurrentTags === 1 && !added)

  for (const game of tag.members) {
      game.filters.tags[tag.id] = added
      game.filters.passesAnyTag = Object.entries(game.filters.tags).some(x => x[1])
      if (!checkAllGames) {
          game.filters.passesAllTags = added
      } else {
          game.filters.passesAllTags = !filteredTags.value.some(tag => !game.filters.tags[tag.id])
      }
  }

  // Go through all filtered games and re-check if they meet all tags
  if (checkAllGames) {
      filteredTags.value.forEach(tag => {
          tag.members.forEach(game => {
              game.filters.passesAllTags = !filteredTags.value.some(tag => !game.filters.tags[tag.id])

          })
      })
  }
}

// const checkingAllTags = ref(false)

export const tags = ref([])

function buildTagList() {
  let foo = {}
  games.value.forEach((game) => {
      for (const linkId in game.tags) {
          if (foo.hasOwnProperty(linkId)) {
              foo[linkId].members.push(game)
          } else {
              foo[linkId] = {
                  name: game.tags[linkId],
                  members: [game]
              }
          }
          game.filters.tags[linkId] = false
      }
  })

  const arr = []
  for (const [tagId, tag] of Object.entries(foo)) {
      if (tag.members.length > 1)
          arr.push({
              id: tagId,
              name: tag.name,
              members: tag.members,
              showCount: tag.members.length,
              filterActive: false
          })
  }
  tags.value = arr
}

export function sortTags(byName) {
  if (byName) {
      tags.value = tags.value.sort((a, b) => a.name.localeCompare(b.name))
  } else {
      tags.value = tags.value.sort((a, b) => b.showCount - a.showCount)
  }  
}

watch(filteredGames, (newGames, oldGames) => {
  let temp = {}
  newGames.forEach((game) => {
      for (const linkId in game.tags) {
          if (temp.hasOwnProperty(linkId)) {
              temp[linkId]++
          } else {
              temp[linkId] = 1
          }
      }
  })

  tags.value.forEach(t => {
      t.showCount = temp[t.id] ?? 0
  })
})
