<template>
    

    <Tag v-for="tag in filteredTags" :key="tag.id" class="tag active" @click="clickedTag(tag)">
        {{ tag.name }}
    </Tag>
    <Divider />

    <ScrollPanel class="tag-scroller">
        <Tag v-for="tag in tags" :key="tag.id" class="tag" :class="{ active: tag.filterActive, grayed: !tag.showCount }"
            @click='clickedTag(tag)'>
            {{ tag.name }}
            <Badge :value="tag.showCount" severity="success"></Badge>
        </Tag>
    </ScrollPanel>
</template>



<script setup>
// <InputSwitch v-model="checkingAllTags" /> Only show games that match all selected tags.

import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import ScrollPanel from 'primevue/scrollpanel'
import InputSwitch from 'primevue/inputswitch'
import { watch } from 'vue'

import { filteredTags, filteredGames } from '~/composables/useGames'

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


</script>

<style scoped></style>