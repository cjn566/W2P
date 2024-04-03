<template>
  <div id="main-container">

    <div id="game-search-row">
      <IconField iconPosition="left" id="searchbox">
        <InputIcon @click="searchGames">
          <i class="pi pi-search" />
        </InputIcon>
        <InputText v-model="queryText" v-on:input="debounce(searchGames, 500)" v-on:keydown.enter="searchGames"
          placeholder="Game Title" ref="input" />
      </IconField>
      <Button id="settings-button" icon="pi pi-sliders-v" @click="showSettings = true" />
    </div>



    <Dialog v-model:visible="showSettings" modal dismissableMask header="Search Settings">
      <div class="settings-modal">
        <p>Search for:</p>
        <div class="setting-row">
          <RadioButton v-model="boardgameVsExpansion" inputId="ipbg" name="pizza" value="boardgame" />
          <label for="ipbg" class="label">Board Games</label>
        </div>
        <div class="setting-row">
          <RadioButton v-model="boardgameVsExpansion" inputId="ipexp" name="pizza" value="boardgameexpansion" />
          <label for="ipexp" class="label">Board Game Expansions</label>
        </div>
        <Divider />
        <div class="setting-row">
          <Checkbox class="form-check-input" type="checkbox" v-model="exact" id="cbExact" />
          <label class="label" for="cbExact">
            Exact match
          </label>
          <i class="pi pi-question-circle"></i>
        </div>
        <Divider />
        <div class="setting-row">
          <label for="limit">Limit to:</label>
          <Dropdown id="limit" v-model="limit" :options="limits" />
          <span style="margin-left: 10px;"></span> results
        </div>
      </div>
      <template #footer>
        <Button label="Done" outlined severity="secondary" @click="showSettings = false" autofocus />
      </template>
    </Dialog>

    <ProgressSpinner v-show="loading" />
    <div class="result-container">
      <ModalSearchResult v-for="game in displayGames" key="game.bgg_game_id" :game="game" @added="added" />
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'debounce'
import { gameSearch } from '../../utils/boardgamegeek'
import { user } from '~/composables/useGames'

const showSettings = ref(false)
const results = ref([])
const exact = ref(false)
const limit = ref(10)
const limits = ref([10, 25, 50])
const boardgameVsExpansion = ref('boardgame')
const queryText = ref('')
const loading = ref(false)
const input = ref(null)


const displayGames = computed(() => {
  return results.value.filter(game => game.type == boardgameVsExpansion.value)
})

async function searchGames(event) {
  // return if not at least 2chars in the search
  if (queryText.value.length < 2) {
    return
  }
  event.target.blur()
  loading.value = true
  results.value = []
  const res = await gameSearch(queryText.value.trim(), boardgameVsExpansion.value, exact.value, limit.value)
  results.value = res.map(game => {
    game.owns = user.value.games.some(x => x.bgg_game_id == game.bgg_game_id)
    return game
  }).sort((a, b) => b.owns - a.owns)
  loading.value = false
}

const added = () => {
  queryText.value = ''
  // input.value.focus()
}



</script>

<style lang="scss" scoped>
#main-container {
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#game-search-row {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem;

  #settings-button {
    margin-left: 1rem;
  }
}

.result-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
}

.settings-modal {
  display: flex;
  flex-direction: column;
  padding: 1rem;

  .setting-row {
    display: flex;
    align-items: center;
    margin-bottom: 6px;

    * {
      margin-left: 10px;
    }
  }
}
</style>
