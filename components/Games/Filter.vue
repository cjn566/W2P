<template>
    <Button @click="filtering = !filtering">Toggle Filter</Button>
    <div v-if="filtering" id="filterFlexContainer">
        <div id="filterResultList">
            <p v-for="game in filteredGames">{{ game.name }}</p>
        </div>
        <div id="filters">
            <h2>Showing {{ filteredGames.length }} of {{ games.length }} games</h2>
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
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
            <GamesDoubleSlider v-model="filters.complexity" _label="How Complex?" :min="limits.complexity[0]"
                :max="limits.complexity[1]" :step="0.1" />
            <Divider />
            <GamesDoubleSlider v-model="filters.time" _label="Play for how long?" :min="limits.time[0]"
                :max="limits.time[1]" :step="15" />
            <Divider />
            <GamesDoubleSlider v-model="filters.year" _label="Year Published" :min="limits.year[0]" :max="limits.year[1]"
                :step="1" />
            <Divider />


            <GamesDoubleSlider v-model="filters.age" _label="Min recommended Age" :min="limits.age[0]" :max="limits.age[1]"
                :step="1" />
            <Divider />



            <Tag v-for="tag in filters.tags" :key="tag.id" class="tag" @click="clickedTag(tag)">
                {{ tag.name }}
            </Tag>
            <Divider />

            <ScrollPanel class="tag-scroller">
                <Tag v-for="tag in tags" :key="tag.id" class="tag" @click='clickedTag(tag)'>
                    {{ tag.name }}
                    <Badge :value="tag.members.length" severity="success"></Badge>
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

import { games } from '~/composables/useGames'

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

    for (const game of tag.members) {
        game.filters.tags[tag.id] = added
        game.filters.passesAnyTag = Object.entries(game.filters.tags).some(x => x[1])
        // Incorrect. when a new tag is added, a game that was previously passing all that doesn't have this tag now isnt passing all
        game.filters.passesAllTags = !filters.value.tags.some(tag => !game.filters.tags[tag.id])
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
                filterActive: false
            })
    }
    return arr.sort((a, b) => a.name.localeCompare(b.name))
}

const tags = ref(tagList())

function checkFilters(filtersObj) {
    filtersObj.passesAll = Object.entries(filtersObj.passes).some(f => !f)
}

const checkingAllTags = ref(false)


// TODO: add logic here to filter on tags or not
// TODO: Check in debugger if this triggers on every update
const filteredGames = computed(() => {
    let checkingTags = filters.value.tags.length > 0
    return games.value.filter(g =>
        g.filters.passesAllSliders &&
        (checkingTags ? 
            ( checkingAllTags? 
                g.filters.passesAllTags : 
                g.filters.passesAnyTag) :
             true)
    )
})

// Makes a ascending sorted array 
function makeIndex(minKey, maxKey = null) {
    const minSorted = games.value.map((game) => [game.filters, game[minKey]]).sort((a, b) => (a[1] - b[1]))
    return {
        // TODO: Map these values to the I/F
        // [ref to passesFilters entry, sorted value of key]
        sorted: {
            min: minSorted,
            max: maxKey ?
                games.value.map((game) => [game.filters, game[maxKey]]).sort((a, b) => (a[1] - b[1]))
                : minSorted
        },
        current: {
            min: {
                value: null,
                index: null
            },
            max: {
                value: null,
                index: null
            }
        }
    }
}


function makeIndices() {
    return {
        complexity: makeIndex('complexity'),
        players: makeIndex('playersMin', 'playersMax'),
        playtime: makeIndex('playtimeMin', 'playtimeMax'),
        age: makeIndex('age'),
        year: makeIndex('year')
    }
}
const indices = ref(makeIndices())

// watch(games, () => {
//     // passesFilters = makePF(newGames)
//     indices.value = makeIndices()
//     // TODO: reset filter values
// })



function filterOnProperty(prop, newValue, keepLessThan) {
    // let prevIdx = indices[filterIdx].current.index
    // if(!preIdx){
    //     prevIdx = isLessThan? 0 : indices[filterIdx].sorted.length
    // }
    let sl = indices[prop].sorted
    let idxNewVal = sl.findIndex(g => g[1] <= newValue)
    let begin, end
    if (keepLessThan) {
        begin = idxNewVal + 1
        end = sl.length
    } else {
        begin = 0
        end = idxNewVal - 1
    }
    for (let i = 0; i < sl.length; i++) {
        let before = sl[i][0].passes[prop]
        // Todo: check inclusivity
        sl[i][0].passes[prop] = keepLessThan ? (i < idxNewVal) : (i > idxNewVal)
        if (before !== sl[i][0].passes[prop]) checkFilters(sl[i][0])
    }
}


// function applyFilter() {
//     // if (!filters.value.areSet) filteredGames.value = games.value
//     let f = filters.value
//     filteredGames.value = games.value.filter((game) => {
//         for (const tag of f.tags) {
//             if (!game[tag[0]][tag[1].id]) return false
//         }

//         if (f.rating && game.rating < f.rating) return false
//         if (f.complexity[0] > 0 && game.complexity < f.complexity[0]) return false
//         if (f.complexity[1] < 5 && game.complexity > f.complexity[1]) return false
//         if (f.players && (game.players.min > f.players
//             || game.players.max < f.players)) return false
//         if (f.time[0] && game.playtime.min < f.time[0]) return false
//         if (f.time[1] && game.playtime.max > f.time[1]) return false
//         if (f.age[0] && game.age < f.age[0]) return false
//         if (f.age[1] && game.age > f.age[1]) return false
//         if (f.year[0] && game.year < f.year[0]) return false
//         if (f.year[1] && game.year > f.year[1]) return false
//         return true
//     })

//     tags.value = tagList(filteredGames.value)
//     for (const tag of f.tags) {
//         tags.value[tag[0]] = tags.value[tag[0]].filter(t => t.id !== tag[1].id)
//     }
// }

const limits = computed(() => {
    return games.value.reduce((limits, game) => {
        limits.time[0] = Math.min(limits.time[0], game.playtimeMin)
        limits.time[1] = Math.max(limits.time[1], game.playtimeMax)
        limits.age[0] = Math.min(limits.age[0], game.age)
        limits.age[1] = Math.max(limits.age[1], game.age)
        limits.complexity[0] = Math.min(limits.complexity[0], game.complexity)
        limits.complexity[1] = Math.max(limits.complexity[1], game.complexity)
        limits.year[0] = Math.min(limits.year[0], game.year)
        limits.year[1] = Math.max(limits.year[1], game.year)
        return limits
    },
        {
            time: [
                1000,
                -1
            ],
            age: [
                100,
                -1
            ],
            complexity: [
                50,
                -1
            ],
            year: [
                5000,
                -1
            ]
        })
})

/* TODO: 
    mark dirty
    n/a values
    filter down tag list

*/

const filters = ref(blankFilters())
const resetFilters = () => {
    let f = filters.value
    let l = limits.value

    f.players = null
    f.rating = null
    f.complexity[0] = l.complexity[0]
    f.complexity[1] = l.complexity[1]
    f.time[0] = l.time[0]
    f.time[1] = l.time[1]
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

