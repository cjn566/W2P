<template>
    <Fieldset :toggleable="true" legend="Filters">

        <label for="numPlayers">How many players?</label>
        <InputNumber v-model="preFilters.players" inputId="numPlayers" showButtons buttonLayout="horizontal"
            decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
            />
        <Divider/>
            <label for="input-rating">At least how well rated?</label>
        <InputNumber v-model="preFilters.rating" inputId="input-rating" showButtons buttonLayout="horizontal" :step="0.1"
            decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
            />
        <Divider />
        <GamesDoubleSlider v-model="preFilters.complexity" _label="How Complex?" :min="0" :max="5" :step="0.1"/>
        <Divider />
        <GamesDoubleSlider v-model="preFilters.time" _label="Play for how long?" :min="0" :max="mostTime" :step="15"/>
        <Divider />
        <GamesDoubleSlider v-model="preFilters.year" _label="Year Published" :min="oldestGame" :max="newestGame" :step="1"/>
        <Divider />
        <GamesDoubleSlider v-model="preFilters.age" _label="Min recommended Age" :min="0" :max="oldestAge" :step="1"/>        
        <Divider />
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
        <Button @click="apply">Apply</Button>
    </Fieldset>
</template>

<script setup>
import blankFilters from './filters'
import Fieldset from 'primevue/fieldset'
import Divider from 'primevue/divider';

import boop from '~/composables/useGames'

const currentYear = new Date().getFullYear()

const mostTime = computed(()=>{
    return boop.games.value.reduce((minutes, game)=>{
        return game.playtime.max > minutes? game.playtime.max : minutes
    }, 0)
})
const oldestAge = computed(()=>{
    return boop.games.value.reduce((age, game)=>{
        return game.age > age? game.age : age
    }, 0)
})
const newestGame = computed(()=>{
    return boop.games.value.reduce((year, game)=>{
        return (game.publishyear > year)? game.publishyear : year
    }, 0)
})
const oldestGame = computed(()=>{
    return boop.games.value.reduce((year, game)=>{
        return (
            (game.publishyear > 0) && 
            (game.publishyear < year) &&
            (game.publishyear > (currentYear - 100)))? game.publishyear : year
    }, 3000)
})

const filters = useState('filters')
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
</style>

