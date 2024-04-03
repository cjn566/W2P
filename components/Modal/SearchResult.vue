<template>
  <Card class="card">
    <template #header>
      <img :src="game.image" alt="Game Thumbnail" class="card-image" />
    </template>
    <template #title><a :href="getGameURL(game.bgg_game_id)" target="_blank" rel="noopener noreferrer" id="bgg-link">{{
      game.name }}</a></template>
    <template #subtitle>{{ game.year ? game.year : '' }}</template>
    <template #content>
      <div class="card-content">

        <ProgressSpinner v-if="loading" />
        <span v-else class="owned">
          <Button v-if="!game.owns" severity="success" icon="pi pi-plus" class="button" @click.stop="addGame"
            label="Add to Library" />
          <div v-if="game.owns" class="owned">
            Owned
            <i class="pi pi-check owned-check"></i>
          </div>
        </span>

      </div>
    </template>
  </card>
</template>

<script setup>
import { addGames, getGameURL } from '~/composables/useGames'
import { useToast } from 'primevue/usetoast'
const toast = useToast()
const props = defineProps(['game'])
const emit = defineEmits(['added'])
const loading = ref(false)

async function addGame() {
  emit('added')
  loading.value = true
  await addGames([props.game])
  // TODO: Check if it failed
  toast.add({ severity: 'success', summary: props.game.name, detail: 'has been added to your library', life: 3000 })
  loading.value = false
}

</script>

<style scoped>
.card {
  width: 300px;
  margin: 1rem;
  overflow: hidden;
}

.card-image {
  width: 100%;
}

#bgg-link {
  color: white;
}

.owned {
  display: flex;
  align-items: center;
}

.card-content {
  display: flex;
  justify-content: center;
  height: 90px;
}

.owned-check {
  margin-left: 0.5rem;
  font-size: 1.5rem;
  color: #4ade80;
}

#icon-check {
  color: #4ade80;
  font-size: x-large;
}
</style>