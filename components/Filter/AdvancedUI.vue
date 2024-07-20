<template>
    <div>
        <GamesDoubleSlider :inValues="filters.complexity" _label="Complexity:" prop="complexity"
            :min="limits.complexity[0]" :max="limits.complexity[1]" :step="0.1" :suffix="' / 5'"/>


        <GamesDoubleSlider :inValues="filters.players" _label="Player count:" prop="players"
            :min="1" :max="12" maxLabel="12+" :step="1" :suffix="' players'"/>


        <GamesDoubleSlider :inValues="filters.playtime" _label="Duration:" prop="playtime"
            :min="limits.playtime[0]" :max="limits.playtime[1]" :step="10" :suffix="' minutes'"/>


        <GamesDoubleSlider :inValues="filters.age" _label="Maturity:" prop="age"
            :min="limits.age[0]" :max="limits.age[1]" :step="1" :suffix="'y.o.'"/>


        <GamesDoubleSlider :inValues="filters.year" _label="Publish Date:" prop="year"
            :min="minYear.val" :max="limits.year[1]" :minLabel="minYear.label" :step="1"/>

        <Divider />

        <Button id="btn-show-tags" icon="pi pi-sliders-v" @click="showTags = true" />

        <Dialog v-model:visible="showTags" modal dismissableMask header="Filter by Tags">
            <FilterTagList :tagList="tags"/>
        </Dialog>
    </div>
</template>

<script setup>
import { filters, limits, tags } from '~/composables/useGames'
import Divider from 'primevue/divider'

const minYear = computed(() => {
    let foo = limits.year[1] - 25
    if(foo > limits.year[0]){
        return {
            val: foo,
            label: '< ' + foo
        }
    } else {
        return {
            val: limits.year[0],
            label: limits.year[0]
        }
    }
})

const showTags = ref(false)

</script>


<style lang="scss" scoped>

</style>