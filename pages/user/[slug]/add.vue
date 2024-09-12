<template>

    <div id="add-games-header">
        <Button icon="pi pi-arrow-left" @click="navigateTo('./')" />
        <span class="title">Add games to your library</span>
    </div>


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
                    <RadioButton v-model="boardgameVsExpansion" inputId="ipexp" name="pizza"
                        value="boardgameexpansion" />
                    <label for="ipexp" class="label">Board Game Expansions</label>
                </div>
                <Divider />
                <div class="setting-row">
                    <Checkbox class="form-check-input" type="checkbox" v-model="exact" id="cbExact" :binary="true" />
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
            <ModalSearchResult v-for="game in results" key="game.bgg_game_id" :game="game" @added="added" />
            <p v-if="searched && !results.length">No results.</p>
        </div>
    </div>
</template>

<script setup>
import { debounce } from 'debounce'
import { user } from '~/composables/useGames'

const showSettings = ref(false)
const searched = ref(false)
const results = ref([])
const exact = ref(false)
const limit = ref(10)
const limits = ref([10, 25, 50])
const boardgameVsExpansion = ref('boardgame')
const queryText = ref('')
const loading = ref(false)
const input = ref(null)


// const displayGames = computed(() => {
//     return results.value.filter(game => game.type == boardgameVsExpansion.value)
// })

async function searchGames(event) {
    // return if not at least 2chars in the search
    if (queryText.value.length < 2) {
        return
    }
    event.target.blur()
    loading.value = true
    searched.value = false
    results.value = []
    nextTick(() => {
        useFetch('/api/bgg/search',
            {
                method: 'get',
                query: {
                    text: queryText.value.trim(),
                    type: boardgameVsExpansion.value,
                    exact: exact.value,
                    limit: limit.value
                }
            }).then(res => {
                results.value = res.data.value.map(game => {
                    game.owns = user.value.games.some(x => x.bgg_game_id == game.bgg_game_id)
                    return game
                }).sort((a, b) => 10 * (b.owns - a.owns) + (b.rating - a.rating))
                searched.value = true
                loading.value = false
            })
    })
}

const added = () => {
    queryText.value = ''
    input.value.$el.focus()
}



</script>

<style lang="scss" scoped>
#add-games-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
    border-bottom: 1px solid blue;

    .title {
        margin-left: 1rem;
    }
}

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
