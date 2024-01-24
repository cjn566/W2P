<template>
       <Divider />
       <Button @click="commitSliderValues('playtime', [limits.playtime[0], 15])">Fast</Button>
       <Button @click="commitSliderValues('playtime', [15, 60])">Medium Length</Button>
       <Button @click="commitSliderValues('playtime', [60, limits.playtime[1]])">Long</Button>
       <Divider />
       <Divider />
       <Divider />
       <Divider />
       
</template>

<script setup>
    import Divider from 'primevue/divider'
    import { commitSliderValues, limits } from '~/composables/useGames'
</script>

<style scoped>
</style>