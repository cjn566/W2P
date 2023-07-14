<template>
    <a :href="gameURL" target="_blank" rel="noopener noreferrer">{{ game.name }}</a>
</template>

<script setup>
const props = defineProps(['game'])

const gameURL = computed(() => {
        return "https://boardgamegeek.com/boardgame/" + props.game.id
    })
    
</script>

<style scoped>
</style>