<template>
  <Card class="mt-4 w-10/12 overflow-hidden">
    <template #header>
      <img :src="game.image" alt="Game Thumbnail" class="w-full" />
    </template>
    <template #title>
      {{ game.name }}  <span class="text-sm">{{ game.year ? `(${game.year})` : '' }}</span>
    </template>
    <template #content>
      <div class="flex justify-center">
        <span class="flex items-center">
          <Button v-if="!game.owns" severity="success" icon="pi pi-plus" @click.stop="addGame" label="Add to Library" />
          <div v-else="game.owns" class="flex items-center">
            Owned
            <i class="pi pi-check ml-2 text-2xl"></i>
          </div>
        </span>

      </div>
    </template>
  </Card>
</template>

<script setup>
import { addGames, getGameURL } from '~/composables/useGames'
import { useToast } from 'primevue/usetoast'
const toast = useToast()
const props = defineProps(['game'])
const emit = defineEmits(['added'])
const loading = ref(false)

async function addGame() {
  loading.value = true
  await addGames([props.game])
  // TODO: Check if it failed
  toast.add({ severity: 'success', summary: props.game.name, detail: 'has been added to your library', life: 3000 })
  loading.value = false
  emit('added')
}

</script>