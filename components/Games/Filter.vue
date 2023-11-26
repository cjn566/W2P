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



            <Tag v-for="tag in filters.tags" class="tag" @click="removeTag(tag[1])">
                {{ tag[1].name }}
            </Tag>
            <Divider />

            <div v-for="type in tagTypes">
                <h4>{{ type.label }}</h4>
                <ScrollPanel class="tag-scroller">
                    <Tag v-for="tag in tags[type.key]" class="tag" @click='addTag(tag)'>
                        {{ tag.name }}
                        <Badge :value="tag.members.length" severity="success"></Badge>
                    </Tag>
                </ScrollPanel>
                <Divider />
            </div>


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

const tagTypes = [
    {
        key: 'boardgamecategory',
        label: "Category"
    },
    {
        key: 'boardgamemechanic',
        label: "Mechanic"
    },
    {
        key: 'boardgamefamily',
        label: "Family"
    }
]

function addTag(tag) {
    filters.value.tags.push(tag)
    filterOnTags(tag, true)
}

function removeTag(tag) {
    filters.value.tags = filters.value.tags.filter(t => tag !== t)
    filterOnTags(tag, false)
}


function filterOnTags(tag, added) {
    for (const gfs of tag.members) {
        let t = gfs.filterSet[tag.id]
        if (added) {
            if (!t) {
                t = true
                checkFilters(gfs)
            }
        } else {
            if (t) {
                t = false
                checkFilters(gfs)
            }
        }
    }
}

// const filteredGames = ref([...games.value])

function tagList() {
    const tags = {}
    for (const key of validTagTypes) {
        tags[key] = {}
    }

    passesFilters.forEach((gfs) => {
        validTagTypes.forEach((tagType) => {
            for (const linkId in gfs.gameRef[tagType]) {
                if (tags[tagType].hasOwnProperty(linkId)) {
                    tags[tagType][linkId].members.push(gfs)
                } else {
                    tags[tagType][linkId] = {
                        name: gfs.gameRef[tagType][linkId].value,
                        members: [gfs]
                    }
                }
                gfs.filterSet[linkId] = true
            }
        })
    })

    for (const type in tags) {
        const arr = []
        for (const id in tags[type]) {
            arr.push({
                id,
                name: tags[type][id].name,
                members: tags[type][id].members
            })
        }
        tags[type] = arr
        tags[type].sort((a, b) => {
            return b.members.length - a.members.length
        })
    }

    return tags
}

function checkFilters(pfObj) {
    pfObj.passesAllFilters = Object.entries(pfObj.filterSet).some(f => !f)
}

function makePF(Gs) {
    return Gs.value.map(g => {
        return {
            gameRef: g,
            filterSet: {
                complexity: true,
                playersMin: true,
                playersMax: true,
                playtimeMin: true,
                playtimeMax: true,
                age: true,
                year: true,
                tags: true
            },
            passesAllFilters: true
        }
    })
}
// TODO: merge these with games list
let passesFilters = makePF(games)

const tags = ref(tagList())

const filteredGames = computed(() => {
    return passesFilters.filter(x => x.passesAllFilters).map(y => y.gameRef)
})

// Makes a ascending sorted array 
function makeIndex(key) {
    return {
        // TODO: Map these values to the I/F
        // [ref to passesFilters entry, sorted value of key]
        sorted: passesFilters.map((pfs) => [pfs, pfs.gameRef[key]]).sort((a, b) => (a[1] - b[1])),
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
        playersMin: makeIndex('playersMin'),
        playersMax: makeIndex('playersMax'),
        playtimeMin: makeIndex('playtimeMin'),
        playtimeMax: makeIndex('playtimeMax'),
        age: makeIndex('age'),
        year: makeIndex('year')
    }
}
const indices = ref(makeIndices())

watch(games, (newGames) => {
    passesFilters = makePF(newGames)
    indices.value = makeIndices()
    // TODO: reset filter values
})



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
        let before = sl[i][0].filterSet[prop]
    // Todo: check inclusivity
        sl[i][0].filterSet[prop] = keepLessThan? (i < idxNewVal) : (i > idxNewVal)
        if(before !== sl[i][0].filterSet[prop]) checkFilters(sl[i][0])
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

