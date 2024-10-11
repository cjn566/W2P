<template>
    <div class="flex items-center" :class="{'active-sort': sorting.active == props.stat}">
        <font-awesome-icon class="mr-2" :icon="['fas', icon]" />
        {{ prefix }}{{ val }}{{ suffix }}
    </div>
</template>

<script setup>
const props = defineProps(['stat', 'val', 'verbose', 'stacked'])
import { sorting } from '~/composables/useGames'

const prefix = ref('')
const suffix = ref('')
const icon = ref('')
switch (props.stat) {
    case 'players':
        icon.value = 'people-group'
        suffix.value = props.verbose ? ' Players' : 'p'
        break
    case 'age':
        icon.value = 'person-cane'
        prefix.value = props.verbose ? 'Ages ' : ''
        suffix.value = props.verbose ? ' and up' : 'y+'
        break
    case 'playtime':
        icon.value = 'hourglass-half'
        suffix.value = props.verbose ? ' Minutes' : 'm'
        break
    case 'complexity':
        icon.value = 'brain'
        suffix.value = ' / 5'
        break
}

</script>

<style lang="scss" scoped></style>