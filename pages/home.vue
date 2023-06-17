<template>
  <div>
    <GameTable/>
  </div>
</template>

<script setup>
  import bgg from '../components/boardgamegeek'
  const auth = useAuth()
  const session = await auth.getSession()
  // await useFetch('/api/collection/add', {query: {bgg_game_id: 8008135}})
  const fetchGames = await useFetch('/api/collection/getAll')
  const gameIds = fetchGames.data.value.map((game) => game.bgg_game_id)
  const gameData =  await bgg.getGameInfo(gameIds)
  const games = useState('games', () => gameData)

</script>
