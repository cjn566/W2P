<template>
    <a :href="gameURL" target="_blank" rel="noopener noreferrer">{{ game.name }}</a>
</template>

<script setup>
const props = defineProps(['game'])

const gameURL = computed(() => {
        return "https://boardgamegeek.com/boardgame/" + props.game.bgg_game_id
    })
    
</script>

<style scoped>
</style>