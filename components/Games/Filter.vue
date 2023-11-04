<template>
    <Button @click="filtering = !filtering">Toggle Filter</Button>
    <div v-show="filtering" id="filterFlexContainer">
        <div id="filterResultList">
            <p v-for="game in displayGames">{{ game.name }}</p>
        </div>
        <Fieldset id="filters" :toggleable="true" legend="Filters">

            <label for="numPlayers">How many players?</label>
            <InputNumber v-model="preFilters.players" inputId="numPlayers" showButtons buttonLayout="horizontal"
                decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success"
                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
            <Divider />
            <label for="input-rating">At least how well rated?</label>
            <InputNumber v-model="preFilters.rating" inputId="input-rating" showButtons buttonLayout="horizontal"
                :step="0.1" decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success"
                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
            <Divider />
            <GamesDoubleSlider v-model="preFilters.complexity" _label="How Complex?" :min="0" :max="5" :step="0.1" />
            <Divider />
            <GamesDoubleSlider v-model="preFilters.time" _label="Play for how long?" :min="0" :max="mostTime" :step="15" />
            <Divider />
            <GamesDoubleSlider v-model="preFilters.year" _label="Year Published" :min="oldestGame" :max="newestGame"
                :step="1" />
            <Divider />
            <GamesDoubleSlider v-model="preFilters.age" _label="Min recommended Age" :min="0" :max="oldestAge" :step="1" />
            <Divider />

            <Tag v-for="tag in preFilters.tags" class="tag">
                {{ tag[1].name }}
            </Tag>
            <Divider />

            <div v-for="type in tagTypes">
                <h4>{{ type.label }}</h4>
                <Tag v-for="tag in tags[type.key].slice(0, 10)" class="tag" @click='addTag(type.key, tag)'>
                    {{ tag.name }}
                    <Badge :value="tag.count" severity="success"></Badge>
                </Tag>
                <Divider />
            </div>


            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
            <Button @click="apply">Apply</Button>
        </Fieldset>
    </div>
    <GamesTestTable v-show="!filtering" :display-games="displayGames" />
</template>

<script setup>
import blankFilters from './filters'
import Fieldset from 'primevue/fieldset'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'

import { games, tags } from '~/composables/useGames'

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
    preFilters.value.tags.push([type, tag])
    apply()
}


const displayGames = computed(() => {
    if (!filters.value.areSet) return games.value
    return games.value.filter((game) => {
        for (const tag of filters.value.tags) {
            if (!game[tag[0]][tag[1].id]) return false
        }

        if (filters.value.rating && game.rating < filters.value.rating) return false
        if (filters.value.complexity[0] > 0 && game.complexity < filters.value.complexity[0]) return false
        if (filters.value.complexity[1] < 5 && game.complexity > filters.value.complexity[1]) return false
        if (filters.value.players && (game.players.min > filters.value.players
            || game.players.max < filters.value.players)) return false
        if (filters.value.time[0] && game.playtime.min < filters.value.time[0]) return false
        if (filters.value.time[1] && game.playtime.max > filters.value.time[1]) return false
        if (filters.value.age[0] && game.age < filters.value.age[0]) return false
        if (filters.value.age[1] && game.age > filters.value.age[1]) return false
        if (filters.value.year[0] && game.publishyear < filters.value.year[0]) return false
        if (filters.value.year[1] && game.publishyear > filters.value.year[1]) return false
        return true
    })
})


const mostTime = computed(() => {
    return displayGames.value.reduce((minutes, game) => {
        return game.playtime.max > minutes ? game.playtime.max : minutes
    }, 0)
})
const oldestAge = computed(() => {
    return displayGames.value.reduce((age, game) => {
        return game.age > age ? game.age : age
    }, 0)
})
const newestGame = computed(() => {
    return displayGames.value.reduce((year, game) => {
        return (game.publishyear > year) ? game.publishyear : year
    }, 0)
})
const oldestGame = computed(() => {
    return displayGames.value.reduce((year, game) => {
        return (
            (game.publishyear > 0) &&
            (game.publishyear < year) &&
            (game.publishyear > (newestGame - 100))) ? game.publishyear : year
    }, 3000)
})

const filters = ref(blankFilters())
const preFilters = ref(blankFilters())
const resetFilters = () => {
    filters.value = blankFilters()
    preFilters.value = blankFilters()
    preFilters.value.players = null
    preFilters.value.rating = 6.0
    preFilters.value.time[1] = mostTime.value
    preFilters.value.age[1] = oldestAge.value
    preFilters.value.year[0] = oldestGame.value
    preFilters.value.year[1] = newestGame.value
}
resetFilters()


const apply = () => {
    filters.value = structuredClone(toRaw(preFilters.value))
    filters.value.areSet = true
}


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
    flex-direction: column;
}

#filterResultList {
    max-width: 20%;
}

#filters {
    flex-shrink: 1;
}
</style>

