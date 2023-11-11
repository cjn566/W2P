<template>
    <Button @click="filtering = !filtering">Toggle Filter</Button>
    <div v-if="filtering" id="filterFlexContainer">
        <div id="filterResultList">
            <p v-for="game in filteredGames">{{ game.name }}</p>
        </div>
        <div id="filters">
            <h2>Showing {{ filteredGames.length }} of {{ games.length }} games</h2>
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
            <Button @click="applyFilter">Apply</Button>
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
            <GamesDoubleSlider v-model="filters.year" _label="Year Published" :min="limits.publishyear[0]"
                :max="limits.publishyear[1]" :step="1" />
            <Divider />
            <GamesDoubleSlider v-model="filters.age" _label="Min recommended Age" :min="limits.age[0]" :max="limits.age[1]"
                :step="1" />
            <Divider />

            <Tag v-for="tag in filters.tags" class="tag" @click="removeTag(tag[1].id)">
                {{ tag[1].name }}
            </Tag>
            <Divider />

            <div v-for="type in tagTypes">
                <h4>{{ type.label }}</h4>
                <ScrollPanel class="tag-scroller">
                    <Tag v-for="tag in tags[type.key]" class="tag" @click='addTag(type.key, tag)'>
                        {{ tag.name }}
                        <Badge :value="tag.count" severity="success"></Badge>
                    </Tag>
                </ScrollPanel>
                <Divider />
            </div>


            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
            <Button @click="applyFilter">Apply</Button>
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

import { games, tagList } from '~/composables/useGames'

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

function addTag(type, tag) {
    filters.value.tags.push([type, tag])
    applyFilter()
}

function removeTag(tagID) {
    filters.value.tags = filters.value.tags.filter(t => tagID !== t[1].id)
    applyFilter()
}

const filteredGames = ref([...games.value])

const tags = ref(tagList(games.value))

// Makes a descending sorted array 
// [game, sorted value of key]
function makeIndex(key) {
    return games.value.map((g) => [g, g[key]]).sort((a, b) => (b[1] - a[1]))
}

const indices = computed(()=>{
    return [
        makeIndex('rating'),        // 0
        makeIndex('complexity'),    // 1
        makeIndex('playersMin'),    // 3
        makeIndex('playersMax'),    // 4
        makeIndex('playtimeMin'),   // 5
        makeIndex('playtimeMax'),   // 6
        makeIndex('age'),           // 7
        makeIndex('publishyear')    // 8
    ]
})

function filterOnField(idx, value, isLessThan) {
    indices[idx].findIndex(g => g[1] >= value)
}

function applyFilter() {
    // if (!filters.value.areSet) filteredGames.value = games.value
    let f = filters.value
    filteredGames.value = games.value.filter((game) => {
        for (const tag of f.tags) {
            if (!game[tag[0]][tag[1].id]) return false
        }

        if (f.rating && game.rating < f.rating) return false
        if (f.complexity[0] > 0 && game.complexity < f.complexity[0]) return false
        if (f.complexity[1] < 5 && game.complexity > f.complexity[1]) return false
        if (f.players && (game.players.min > f.players
            || game.players.max < f.players)) return false
        if (f.time[0] && game.playtime.min < f.time[0]) return false
        if (f.time[1] && game.playtime.max > f.time[1]) return false
        if (f.age[0] && game.age < f.age[0]) return false
        if (f.age[1] && game.age > f.age[1]) return false
        if (f.year[0] && game.publishyear < f.year[0]) return false
        if (f.year[1] && game.publishyear > f.year[1]) return false
        return true
    })

    tags.value = tagList(filteredGames.value)
    for (const tag of f.tags) {
        tags.value[tag[0]] = tags.value[tag[0]].filter(t => t.id !== tag[1].id)
    }
}

const limits = computed(() => {
    return games.value.reduce((limits, game) => {
        limits.time[0] = Math.min(limits.time[0], game.playtime.min)
        limits.time[1] = Math.max(limits.time[1], game.playtime.max)
        limits.age[0] = Math.min(limits.age[0], game.age)
        limits.age[1] = Math.max(limits.age[1], game.age)
        limits.complexity[0] = Math.min(limits.complexity[0], game.complexity)
        limits.complexity[1] = Math.max(limits.complexity[1], game.complexity)
        limits.publishyear[0] = Math.min(limits.publishyear[0], game.publishyear)
        limits.publishyear[1] = Math.max(limits.publishyear[1], game.publishyear)
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
            publishyear: [
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
    f.year[0] = l.publishyear[0]
    f.year[1] = l.publishyear[1]

    filteredGames.value = [...games.value]
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

