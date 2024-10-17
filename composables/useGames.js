import { makeArray } from '~/utils/makearray'


export async function addGames(cId, newGames) {
  // status.value.gamesReady = false
  newGames = makeArray(newGames)
  const gameIDs = newGames.map(x => x.bgg_game_id)
  const res = (await $fetch('/api/collection/game/add',
    {
      method: 'post',
      body: { gameIDs, cId }
    }))

  if (res.err) {
    toast.add({ severity: 'error', summary: 'Something went wrong', detail: 'it broke.', life: 3000 })
  } else {
    res.forEach((r) => {
      if (r.err && r.msg == "duplicate") {
        toast.add({ severity: 'error', summary: 'Cannot add that game', detail: 'That game was already in your library', life: 3000 })
      } else {
        user.value.collections[cId].gameIDs.push(r.bgg_game_id)
        // toast.add({ severity: 'success', summary: `${g.name} was added to your library.`, life: 3000 })
      }
    })
  }
  // TODO: see where callers need to rebuildCollection()
}

export async function addSelectedToCollection(cId) {
  await addGames(cId, gamesArray.value.filter(g => g.selected))
}


export async function removeSelectedGames() {
  status.value.gamesReady = false
  const gameIDs = gamesArray.value.filter(g => g.selected).map(g => g.bgg_game_id)
  const res = (await $fetch('/api/collection/game/remove',
    {
      method: 'post',
      body: { gameIDs, cId: currentCollection.value }
    }))
  if (res.err) {
    toast.add({ severity: 'error', summary: 'Something went wrong', detail: 'it broke.', life: 3000 })
  } else {
    res.forEach((r) => {
      gamesMap.value.delete(r.bgg_game_id)
    })
    buildCollection()
  }
}


export async function addCollection(name) {
  const res = (await $fetch('/api/collection/add',
    {
      method: 'get',
      params: { name }
    }))
  user.value.collections[res.id] = res
  setCurrentCollection(res.id)
}

export async function editCollection(name, cId) {
  const res = await $fetch('/api/collection/edit', {
    method: 'post',
    body: { name, cId }
  })
  user.value.collections[cId].collection_name = res.name
  // TODO: Toasts
}


// TODO: needs fixed
export async function removeCollection(cId) {
  status.value.gamesReady = false
  try {
    await $fetch('/api/collection/remove', {
      method: 'get',
      params: { cId }
    })    
    toast.add({ severity: 'success', summary: `Deleted '${user.value.collections[cId].collection_name}'`, life: 3000 })
    delete user.value.collections[cId]
    setCurrentCollection(null)
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Failed to delete', detail: 'Server says: ' + e.msg, life: 3000 })
  }
}

// ^^^^^^^^^^^^^^ API Calls ^^^^^^^^^^^^^^ 
// vvvvvvvvvvvvvv Everything else vvvvvvvvvvvvvv

export function getGameURL(id) {
  return `https://boardgamegeek.com/boardgame/${id}`
}

export const user = ref({})

export const status = ref({
  userReady: false,
  gamesReady: false
})


export const gamesMap = ref(null)
export const gamesArray = ref([])
export const tagsMap = ref(null)
export const tagsArray = ref([])

export var limits = {}

const indices = ref({})

// removeGames,

export const currentCollection = ref(null)
export async function setCurrentCollection(id) {

  if (id && id === currentCollection.value) return
  if (!id || !user.value.collections.hasOwnProperty(id)) {
    if (user.value.collections.hasOwnProperty(user.value.default_collection_id)) {
      id = user.value.default_collection_id
    } else if (Object.keys(user.value.collections).length) {
      id = Object.keys(user.value.collections)[0]
    } else {
      id = null
    }
  }
  id = parseInt(id)

  currentCollection.value = id
  status.value.gamesReady = false
  // First get game info for any games not already in the allGames object

  if (id) {
    let preGames = user.value.collections[id].gameIDs.reduce((snowball, g) => {
      let q = JSON.parse(localStorage.getItem(g.bgg_game_id))
      if (q) {
        if (q.exp < Date.now()) {
          localStorage.removeItem(g.bgg_game_id)
          snowball.needGameIDs.push(g.bgg_game_id)
        } else {
          snowball.foundGames.set(g.bgg_game_id, q.game)
        }
      } else {
        snowball.needGameIDs.push(g.bgg_game_id)
      }
      return snowball
    }, { foundGames: new Map(), needGameIDs: [] })

    let restOfTheGames = new Map()
    if (preGames.needGameIDs.length) {
      restOfTheGames = new Map(Object.entries((await $fetch('/api/collection/game/get', {
        method: 'post',
        body: preGames.needGameIDs
      }))).map(g => ([parseInt(g[0]), g[1]])))

      let exp = Date.now() + 1000 * 60 * 60 * 24 * 7
      restOfTheGames.forEach((game, id) => {
        localStorage.setItem(id, JSON.stringify({ exp, game }))
      })
    }
    gamesMap.value = new Map([...preGames.foundGames, ...restOfTheGames])
  } else {
    gamesMap.value = new Map()
  }
  buildCollection()
}

export async function buildCollection() {
  status.value.gamesReady = false

  if (gamesMap.value.size == 0) {
    gamesArray.value = []
    status.value.gamesReady = true
    return
  }

  limits = {
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
  }

  tagsMap.value = new Map()

  let dp = new DOMParser()
  gamesMap.value.forEach((g, id, map) => {
    g.bgg_game_id = parseInt(g.bgg_game_id)
    g.canExpandGameId = g.canExpandGameId?.map(x => parseInt(x))
    g.description = dp.parseFromString(g.description, 'text/html').documentElement.textContent
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

    if (g.type === "boardgameexpansion") {
      g.canExpandGameId.forEach(gid => {
        const baseGame = map.get(gid)
        if (baseGame) {
          (baseGame.ownedExpansions ??= []).push(g)
          g.isExpansionFor.push(baseGame)
        }
      })
    }

    for (const id in g.tags) {
      if (tagsMap.value.has(id)) {
        let tag = tagsMap.value.get(id)
        tag.members.push(g)
        tag.showCount++
      } else {
        tagsMap.value.set(id, {
          id,
          name: g.tags[id],
          members: [g]
        })
      }
    }


    if (g.complexity > 0.1) {
      limits.complexity[0] = Math.min(limits.complexity[0], g.complexity)
      limits.complexity[1] = Math.max(limits.complexity[1], g.complexity)
    }
    if (g.playersMin > 0) {
      limits.players[0] = Math.min(limits.players[0], g.playersMin)
    }
    limits.players[1] = Math.max(limits.players[1], g.playersMax)
    if (g.playtimeMin > 0) {
      limits.playtime[0] = Math.min(limits.playtime[0], g.playtimeMin)
    }
    limits.playtime[1] = Math.max(limits.playtime[1], g.playtimeMax)
    if (g.age > 0) {
      limits.age[0] = Math.min(limits.age[0], g.age)
      limits.age[1] = Math.max(limits.age[1], g.age)
    }
    if (g.year > 0) {
      limits.year[0] = Math.min(limits.year[0], g.year)
      limits.year[1] = Math.max(limits.year[1], g.year)
    }

  })


  gamesArray.value = Array.from(gamesMap.value.values())

  tagsArray.value = Array.from(tagsMap.value.values()).map(tag => ({
    ...tag,
    filterActive: false,
    showCount: tag.members.length
  })).filter(tag => tag.showCount > 1)

  indices.value = makeIndices()

  sortBy('name', true)

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

export const numActiveFilters = computed(() => {
  return filteredTags.value.size + Object.values(filters.value).filter(f => f.active).length + (searchTerm.value.trim().length > 1 ? 1 : 0)
})


// Makes an ascending sorted array 
function makeIndex(minKey, maxKey = null) {
  const minSorted = gamesArray.value.map((game) => ({ filters: game.filters, propValue: game[minKey] })).sort((a, b) => (a.propValue - b.propValue))
  return {
    sorted: [
      minSorted,
      maxKey ?
        gamesArray.value.map((game) => ({ filters: game.filters, propValue: game[maxKey] })).sort((a, b) => (a.propValue - b.propValue))
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

export function clearAllFilters() {
  clearAllTags()
  clearAllSliders()
}

export function clearAllSliders() {
  for (const prop in filters.value) {
    if (filters.value[prop].active) clearSlider(prop)
  }
}

export function clearSlider(prop) {
  // Clear all, set to limits and indices to null
  indices.value[prop].current[0].index = null
  indices.value[prop].current[0].value = limits[prop][0]

  indices.value[prop].current[1].index = null
  indices.value[prop].current[1].value = limits[prop][1]

  gamesArray.value.forEach(game => {
    game.filters.sliders[prop][0] = true
    game.filters.sliders[prop][1] = true
    game.filters.passesAllSliders = Object.values(game.filters.sliders).every(x => x[0] && x[1])
  })
}

export const numPlayers = ref(null)
export const gameLength = ref(null)

export function setSlider(prop, LT, newVal) {

  // Get the appropriate filter set
  let propSet = indices.value[prop]

  // If the value is the same, skip
  if (newVal === propSet.current[LT].value) return

  // Get the previous index. If it's null, set to the end or beginning
  let prevIdx = propSet.current[LT].index ?? (LT ? propSet.sorted[LT].length - 1 : 0)
  let newIdx

  // Find the new index out of the sorted array. If it's being reset, it will be the first or last
  if (newVal === null) {
    newIdx = LT ? (propSet.sorted[LT].length - 1) : 0
    propSet.current[LT].index = null
  } else {
    if (LT) {
      newIdx = propSet.sorted[LT].findLastIndex(g => newVal >= g.propValue)
    } else {
      newIdx = propSet.sorted[LT].findIndex(g => newVal <= g.propValue)
    }
    propSet.current[LT].index = newIdx
  }
  propSet.current[LT].value = newVal

  // Compute how many games need to be toggled
  let toggleCount = prevIdx - newIdx

  // If no games, then skip
  if (!toggleCount) return

  let begin = 0, end = 0, toggle = true
  // If moving left vs right, the begin and end are swapped
  // and set whether games now pass or fail the filter
  if (toggleCount > 0) {
    begin = newIdx + LT
    end = prevIdx + LT
    toggle = LT === 0
  } else {
    begin = prevIdx + LT
    end = newIdx + LT
    toggle = LT === 1
  }

  // Process through the games and set the pass state for the filter,
  // then check if the game passes all filters
  propSet.sorted[LT].slice(begin, end).forEach(indexEntry => {
    indexEntry.filters.sliders[prop][LT] = toggle
    indexEntry.filters.passesAllSliders = Object.values(indexEntry.filters.sliders).every(p => p[0] && p[1])
  })
}


export const searchTerm = ref('')

export const editingGames = ref(true)

export const filteredGames = computed(() => {
  let ret = gamesArray.value

  // TODO: make sure filtered games always include selected games
  // TODO: searching text breaks the detial component
  if (searchTerm.value.trim().length > 1) {
    ret = ret.filter(g => g.searchName.includes(searchTerm.value.trim().toLowerCase()))
  }

  let checkingTags = filteredTags.value.size
  ret = ret.filter(g =>
    g.filters.passesAllSliders &&
    (checkingTags ? g.filters.passesAllTags : true)
  )
  return ret
})

export const filteredNoExpansions = computed(() => {
  return filteredGames.value.filter(g => !g.isExpansionFor.length)
})

export const selectedButFilteredOut = computed(() => {
  return editingGames.value ? gamesArray.value.filter(g => g.selected && !filteredGames.value.includes(g)) : []
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

export function sortBy(prop, descending) {

  if (prop === sorting.value.prop && descending === sorting.value.descending) return

  sorting.value.active = prop
  sorting.value.descending = descending

  switch (prop) {
    case 'players':
      if (!descending) {
        gamesArray.value = gamesArray.value.sort((a, b) => {
          if (!a.playersMax && !a.playersMin) return 1
          if (!b.playersMax && !b.playersMin) return -1
          return a.playersMin - b.playersMin + ((a.playersMax - b.playersMax) / 1000)
        })
      } else {
        gamesArray.value = gamesArray.value.sort((a, b) => {
          return b.playersMax - a.playersMax + ((b.playersMin - a.playersMin) / 1000)
        })
      }
      break
    case 'playtime':
      if (!descending) {
        gamesArray.value = gamesArray.value.sort((a, b) => {
          if (!a.playtimeMax && !a.playtimeMin) return 1
          if (!b.playtimeMax && !b.playtimeMin) return -1
          return (a.playtimeMin - b.playtimeMin + ((a.playtimeMax - b.playtimeMax) / 1000))
        })
      } else {
        gamesArray.value = gamesArray.value.sort((a, b) => {
          return b.playtimeMax - a.playtimeMax + ((b.playtimeMin - a.playtimeMin) / 1000)
        })
      }
      break
    case 'name':
      gamesArray.value = gamesArray.value.sort((a, b) => {
        return b.name.localeCompare(a.name) * (sorting.value.descending ? -1 : 1)
      })
      break
    default:
      gamesArray.value = gamesArray.value.sort((a, b) => {
        if (!a[sorting.value.active]) return 1
        if (!b[sorting.value.active]) return -1
        return (a[sorting.value.active] - b[sorting.value.active]) * (sorting.value.descending ? -1 : 1)
      })
      break
  }
}


export const filteredTags = ref(new Map())

export function clearAllTags() {
  filteredTags.value.forEach(tag => {
    tag.filterActive = false
    for (const game of tag.members) {
      game.filters.tags[tag.id] = false
      game.filters.passesAnyTag = false
      game.filters.passesAllTags = true
    }
  })
  filteredTags.value.clear()
}

export function clickedTag(tag) {
  let added = !tag.filterActive
  if (!added) {
    tag.filterActive = false
    filteredTags.value.delete(tag.id)
  } else {
    tag.filterActive = true
    filteredTags.value.set(tag.id, tag)
  }

  let numCurrentTags = filteredTags.value.size
  let checkAllGames = numCurrentTags > 1 || (numCurrentTags === 1 && !added)

  for (let game of tag.members) {
    game.filters.tags[tag.id] = added
    game.filters.passesAnyTag = Object.values(game.filters.tags).some(x => x)
    if (!checkAllGames) {
      game.filters.passesAllTags = added
    } else {
      game.filters.passesAllTags = [...filteredTags.value.keys()].every(tid => game.filters.tags[tid])
    }
  }

  // Go through all filtered games and re-check if they meet all tags
  if (checkAllGames) {
    filteredTags.value.forEach(tag => {
      tag.members.forEach(game => {
        game.filters.passesAllTags = [...filteredTags.value.keys()].every(tid => game.filters.tags[tid])
      })
    })
  }
}


export function sortTags(byName) {
  if (byName) {
    tagsArray.value = tagsArray.value.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    tagsArray.value = tagsArray.value.sort((a, b) => b.showCount - a.showCount)
  }
}

watch(filteredGames, (newGames, oldGames) => {
  if (newGames.length === gamesArray.length) {
    tagsArray.value.forEach(t => {
      t.showCount = t.members.length
    })
  } else {
    let temp = {}
    newGames.forEach((game) => {
      for (const linkId in game.tags) {
        temp[linkId] = (temp[linkId] ?? 0) + 1;
      }
    })
    tagsArray.value.forEach(t => {
      t.showCount = temp[t.id] ?? 0
    })
  }
})
