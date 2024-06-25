import { games, filteredGames, filteredTags } from '~/composables/useGames'

export const sortOptions = ref([
  { label: 'Alphabetical', sortByName: true, icon: 'arrow-down-a-z' },
  { label: 'Count', sortByName: false, icon: 'hashtag' }
])
export const sort = ref(sortOptions.value[0])

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


function tagList() {
  let tags = {}
  games.value.forEach((game) => {
      for (const linkId in game.tags) {
          if (tags.hasOwnProperty(linkId)) {
              tags[linkId].members.push(game)
          } else {
              tags[linkId] = {
                  name: game.tags[linkId],
                  members: [game]
              }
          }
          game.filters.tags[linkId] = false
      }
  })

  const arr = []
  for (const [tagId, tag] of Object.entries(tags)) {
      if (tag.members.length > 1)
          arr.push({
              id: tagId,
              name: tag.name,
              members: tag.members,
              showCount: tag.members.length,
              filterActive: false
          })
  }
  return arr.sort((a, b) => a.name.localeCompare(b.name))
}

export const tags = ref(tagList())

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

watch(sort, (newSort, oldSort) => {
  if (newSort.sortByName) {
      tags.value = tags.value.sort((a, b) => a.name.localeCompare(b.name))
  } else {
      tags.value = tags.value.sort((a, b) => b.showCount - a.showCount)
  }
})
