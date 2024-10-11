<template>
    <Chip v-if="index.active" :label="label" removable
        @click="clearSlider(field)" />
</template>

<script setup>

import { clearSlider } from '~/composables/useGames'
const props = defineProps(['index', 'field'])

const label = computed(() => {
    let gt = props.index.values[0]
    let lt = props.index.values[1]

    if (gt !== null && lt !== null) {
        // Window
        let exact = gt === lt
        let range = gt + (exact? '' : ' - ' + lt)
        switch (props.field) {
            case 'complexity':
                return "complexity " + (exact? " of " + gt : " from " + range)
                
            case 'players':
                return `for ${range} player${exact && gt === 1? '' : 's'}`
                
            case 'playtime':
                return `${range} minutes`
                
            case 'age':
                return `for ages ${range} and up`
                
            case 'year':
                return "published " + (exact? " in " + gt : " from " + range)
                
        }
    } else if (gt !== null) {
        // Greater than
        switch (props.field) {
            case 'complexity':
                return `at least ${gt} complexity`
                
            case 'players':
                return `for ${gt} or more players`
                
            case 'playtime':
                return `${gt} minutes or longer`
                
            case 'age':
                return `for ages ${gt} and up`
                
            case 'year':
                return `${gt} or newer`
                
        }
    } else if (lt !== null) {
        // Less than
        switch (props.field) {
            case 'complexity':
                return `at most ${lt} complexity`
                
            case 'players':
                return `for ${lt} or fewer players`
                
            case 'playtime':
                return `${lt} minutes or shorter`
                
            case 'age':
                return `maturity ${lt} or younger`
                
            case 'year':
                return `${lt} or older`
                
        }
    } else {
        // ??
        return '???'
    }

    return ret
})


</script>

<style lang="scss" scoped></style>