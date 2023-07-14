<template>
  <div>
    Is authenticated: {{ isAuthenticated }}
    <pre>
      {{ userData }}
    </pre>
    <pre v-if="isAuthenticated">
      {{ session }}
    </pre>
    <GamesTable/>
  </div>
</template>

<script setup>
  import bgg from '../../utils/boardgamegeek'
  
  definePageMeta({ auth: false })

  const isAuthenticated = ref(false)
  const isOwnPage = ref(false)
  const session = ref(false)
  const auth = useAuth()

  const route = useRoute()
  const userSlug = route.params.slug
  const fetchUser = await useFetch('/api/user/' + userSlug)
  const userData = fetchUser.data.value

  if(auth.status.value == 'authenticated') {
    isAuthenticated.value = true
    session.value = await auth.getSession()
  }


  if(!userData.err_code){
    const gameIds = userData.games.map((game) => game.bgg_game_id)
    const gameData =  await bgg.getGameInfo(gameIds)
    const games = useState('games', () => gameData)
  }

</script>
