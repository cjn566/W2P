<template>
  <div class="card">
    <img :src="game.thumbnail" alt="Game Thumbnail" class="game-thumbnail"/>
    <div class="card-body">
      <b class="card-title">{{ game.name }}</b>
      <p class="card-text">{{ game.publishyear ? game.publishyear : 'N/A' }}</p>
      <a v-if="!game.owns" href="#" class="btn btn-success" @click.stop="addGames([props.game])">+</a>
      <a v-else="!game.owns" href="#" class="btn btn-secondary" disabled>/</a>
    </div>
  </div>
</template>

<script setup>
import { addGames } from '~/composables/useGames'
const props = defineProps(['game'])

</script>

<style scoped>
  
</style>