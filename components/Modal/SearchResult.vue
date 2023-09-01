<template>
  <div class="card">
    <img :src="game.image" alt="Game Thumbnail" class="game-thumbnail"/>
    <div class="card-body">
      <b class="card-title">{{ game.name }}</b>
      <p class="card-text">{{ game.publishyear ? game.publishyear : 'N/A' }}</p>
      <a v-if="!game.owns" href="#" class="btn btn-success" @click.stop="addGame">+</a>
      <a v-else="!game.owns" href="#" class="btn btn-secondary" disabled>/</a>
    </div>
  </div>
</template>

<script setup>

const props = defineProps(['game'])

async function addGame() {
    const res = (await useFetch('/api/collection/add', 
    {
      method: 'post',
      body: [props.game.bgg_game_id]
    })).data.value
    if(res.err) {
      console.error(res.msg)
    } else {
      const newGame = props.game
      props.game.owns = true
      newGame.id = res.newID
      const allGames = useState('games')
      allGames.value.push(newGame)
      $toast.open('Game added.')
    }
}

</script>

<style scoped>
  
</style>