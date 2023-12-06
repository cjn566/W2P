<template>
    <Button @click="filtering = !filtering">Toggle Filter</Button>
    <div v-if="filtering" id="filterFlexContainer">
        <div id="filterResultList">
            <p v-for="game in filteredGames">{{ game.name }}</p>
        </div>
        <div id="filters">
            <h2>Showing {{ filteredGames.length }} of {{ games.length }} games</h2>
            
            <Divider />
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
            
            <Divider />
            <label for="numPlayers">How many players?</label>
            <InputNumber v-model="filters.players" inputId="numPlayers" showButtons buttonLayout="horizontal"
                decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success"
                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
            <Divider />
            <label for="input-rating">At least how well rated?</label>
            <InputNumber v-model="filters.rating" inputId="input-rating" showButtons buttonLayout="horizontal" :step="0.1"
                decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success"
                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
            <Divider />

            
            <GamesDoubleSlider :values="indices.complexity.current" _label="How Complex?" :min="limits.complexity[0]"
                :max="limits.complexity[1]" :step="0.1" @set-value="filterOnProperty"/>
            <Divider />
            <!-- <GamesDoubleSlider v-model="filters.time" _label="Play for how long?" :min="limits.time[0]"
                :max="limits.time[1]" :step="15" />
            <Divider />
            <GamesDoubleSlider v-model="filters.year" _label="Year Published" :min="limits.year[0]" :max="limits.year[1]"
                :step="1" />
            <Divider />


            <GamesDoubleSlider v-model="filters.age" _label="Min recommended Age" :min="limits.age[0]" :max="limits.age[1]"
                :step="1" />
            <Divider /> -->



            <InputSwitch v-model="checkingAllTags" /> Only show games that match all selected tags.

            <Tag v-for="tag in filters.tags" :key="tag.id" class="tag active" @click="clickedTag(tag)">
                {{ tag.name }}
            </Tag>
            <Divider />

            <ScrollPanel class="tag-scroller">
                <Tag v-for="tag in tags" :key="tag.id" class="tag"
                    :class="{ active: tag.filterActive, grayed: !tag.showCount }" @click='clickedTag(tag)'>
                    {{ tag.name }}
                    <Badge :value="tag.showCount" severity="success"></Badge>
                </Tag>
            </ScrollPanel>
            <Divider />


            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
        </div>
    </div>
    <GamesTestTable v-else :display-games="filteredGames" />
</template>

<script setup>
import blankFilters from './filters'
import Fieldset from 'primevue/fieldset'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import ScrollPanel from 'primevue/scrollpanel'

import InputSwitch from 'primevue/inputswitch'


import { games } from '~/composables/useGames'
import { faListSquares } from '@fortawesome/free-solid-svg-icons'

const filtering = ref(true)


function clickedTag(tag) {
    let tagIdx = filters.value.tags.indexOf(tag)
    let added = tagIdx === -1
    if (added) {
        tag.filterActive = true
        filters.value.tags.push(tag)
    } else {
        tag.filterActive = false
        filters.value.tags.splice(tagIdx, 1)
    }

    let numCurrentTags = filters.value.tags.length
    let checkAllGames = numCurrentTags > 1 || (numCurrentTags === 1 && !added)

    for (const game of tag.members) {
        game.filters.tags[tag.id] = added
        game.filters.passesAnyTag = Object.entries(game.filters.tags).some(x => x[1])
        if (!checkAllGames) {
            game.filters.passesAllTags = added
        } else {
            game.filters.passesAllTags = !filters.value.tags.some(tag => !game.filters.tags[tag.id])
        }
    }

    // Go through all filtered games and re-check if they meet all tags
    if (checkAllGames) {
        filters.value.tags.forEach(tag => {
            tag.members.forEach(game => {
                game.filters.passesAllTags = !filters.value.tags.some(tag => !game.filters.tags[tag.id])

            })
        })
    }
}


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

function checkSliders(filtersObj) {
    filtersObj.passesAllSliders = !Object.entries(filtersObj.sliders).some(x => !x[1][0] || !x[1][1])
}

const checkingAllTags = ref(false)


// TODO: add logic here to filter on tags or not
// TODO: Check in debugger if this triggers on every update
const filteredGames = computed(() => {
    let checkingTags = filters.value.tags.length > 0
    let ret = games.value.filter(g =>
        g.filters.passesAllSliders &&
        (checkingTags ?
            (checkingAllTags.value ?
                g.filters.passesAllTags :
                g.filters.passesAnyTag) :
            true)
    )

    let temp = {}
    ret.forEach((game) => {
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

    return ret
})

function makeLimits() {
    return games.value.reduce((limits, game) => {
        limits.complexity[0] = Math.min(limits.complexity[0], game.complexity)
        limits.complexity[1] = Math.max(limits.complexity[1], game.complexity)
        limits.players[0] = Math.min(limits.players[0], game.playersMin)
        limits.players[1] = Math.max(limits.players[1], game.playersMax)
        limits.playtime[0] = Math.min(limits.playtime[0], game.playtimeMin)
        limits.playtime[1] = Math.max(limits.playtime[1], game.playtimeMax)
        limits.age[0] = Math.min(limits.age[0], game.age)
        limits.age[1] = Math.max(limits.age[1], game.age)
        limits.year[0] = Math.min(limits.year[0], game.year)
        limits.year[1] = Math.max(limits.year[1], game.year)
        return limits
    },
        {
            complexity: [
                50,
                -1
            ],
            players: [
                1000,
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

const limits = makeLimits()

// Makes a ascending sorted array 
function makeIndex(minKey, maxKey = null) {
    const minSorted = games.value.map((game) => [game.filters, game[minKey]]).sort((a, b) => (a[1] - b[1]))
    return {
        // TODO: Map these values to the I/F
        // [ref to passesFilters entry, sorted value of key]
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
        players: makeIndex('playersMin', 'playersMax'),
        playtime: makeIndex('playtimeMin', 'playtimeMax'),
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
const indices = ref(makeIndices())

// watch(games, () => {
//     // passesFilters = makePF(newGames)
//     indices.value = makeIndices()
//     // TODO: reset filter values
// })



function filterOnProperty(prop, newValue, ltgt) {
    let foo = indices.value[prop]
    let prevIdx = foo.current[ltgt].index ?? (ltgt ? 0 : foo.sorted[ltgt].length)
    let newIdx = foo.sorted[ltgt].findIndex(g => newValue <= g[1])
    foo.current[ltgt].value = newValue
    foo.current[ltgt].index = newIdx
    let toggleCount = prevIdx - newIdx
    if(!toggleCount) return
    let begin = 0, end = 0, toggle = true
    if(toggleCount > 0){
        begin = newIdx
        end = prevIdx
        toggle = ltgt === 0
    } else {
        begin = prevIdx
        end = newIdx
        toggle = ltgt === 1
    }
    foo.sorted[ltgt].slice(begin, end).forEach(bar => {
        bar[0].sliders[prop][ltgt] = toggle
        checkSliders(bar[0])
    })
}



/* TODO: 
    mark dirty
    n/a values
    filter down tag list

*/

const filters = ref(blankFilters())
const resetFilters = () => {
    let f = filters.value
    let l = limits

    f.players = null
    f.rating = null
    f.complexity[0] = l.complexity[0]
    f.complexity[1] = l.complexity[1]
    f.time[0] = l.playtime[0]
    f.time[1] = l.playtime[1]
    f.age[0] = l.age[0]
    f.age[1] = l.age[1]
    f.year[0] = l.year[0]
    f.year[1] = l.year[1]
}
resetFilters()



</script>

<style scoped>
.slider-thing {
    margin: 0 1rem;
}

.tag {
    margin: 1px;
}

.active {
    background-color: orange;
}

.grayed {
    background-color: gray;
}

#filterFlexContainer {
    display: flex;
    flex-direction: row;
}

#filterResultList {
    width: 20%;
    margin: 5px;
}

#filters {
    flex-shrink: 1;
}

.tag-scroller {
    height: 200px;
}
</style>

