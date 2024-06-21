<template>
    <div id="tags-container">
        <div id="header">
            <div id="active-tags">
                <Chip v-for="tag in filteredTags" :key="tag.id" :label="tag.name" removable class="selected-tag active"
                    @click="clickedTag(tag)" />
            </div>
            <div id="sort-btns"></div>
            <SelectButton v-model="sort" :options="sortOptions" :pt="{ root: 'btn-sort' }">
                <template #option="slotProps">
                    <font-awesome-icon :icon="['fas', slotProps.option.icon]" />
                </template>
            </SelectButton>
        </div>
        <Divider />
        <ScrollPanel id="tag-scroller">
            <Tag v-for="tag in tags" :key="tag.id" class="tag" :severity="tag.showCount ? '' : 'secondary'"
                :class="{ active: tag.filterActive }" @click='clickedTag(tag)'>
                {{ tag.name }}
                <Badge :value="tag.showCount" :severity="tag.showCount ? 'success' : 'secondary'" class="count" />
            </Tag>
        </ScrollPanel>
    </div>
</template>

<script setup>

const sortOptions = ref([
    { label: 'Alphabetical', sortByName: true, icon: 'arrow-down-a-z' },
    { label: 'Count', sortByName: false, icon: 'hashtag' }
])
const sort = ref(sortOptions.value[0])

function clickedTag(tag) {
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

const tags = ref(tagList())



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


</script>

<style lang="scss" scoped>
#tags-container {
    background-color: $w2p-pallette-4;
    border-radius: 0.5rem;
    padding: 0.5rem;
}

#header {
    display: flex;
    flex-direction: row;
    justify-content: end;
    min-height: 2rem;
    margin-bottom: 0.5rem;
}

#active-tags {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}

#sort-btns {
    flex-shrink: 1;
    display: flex;
    align-items: center;
}

.tag {
    margin: 0.15rem;
    cursor: pointer;
}

.selected-tag {
    margin-left: 0.5rem;
}

.active-icon {
    margin-left: 2px;
    font-size: 0.75rem;
}

#tag-scroller {
    height: 300px;
    width: 100%;
}

.grayed {
    background-color: #aaaaaa;
}

.count {
    margin-left: 3px;
}

.active {
    background-color: #0058f0;
    color: white;
}
</style>