<template>
    <transition name="modal">
        <div class="modal-overlay" @click.self="$emit('dismiss')">
            <div class="h-[90vh] bg-surface-200 text-black rounded-md relative w-[90vw] lg:w-2/3" @click.stop=""
                @touch.stop="">

                <!-- Header -->
                <div class="h-16 border-slate-500 border-b-2 flex items-center relative">
                    <span class="ml-4 grow flex justify-center text-xl">
                        Add games to {{ user?.collections[currentCollection]?.collection_name }}
                    </span>
                    <i class="pi pi-times text-xl rounded-full border-black border-2 p-2 mr-4"
                        @click="$emit('dismiss')" />
                </div>

                <div class="flex flex-col items-center h-full">

                    <div class="flex mt-8">
                        <IconField iconPosition="left" id="searchbox">
                            <InputIcon @click="searchGames">
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="queryText" v-on:input="debounce(searchGames, 500)"
                                v-on:keydown.enter="searchGames" placeholder="Game Title" ref="input" />
                        </IconField>
                        <Button severity="secondary" icon="pi pi-sliders-v" @click="showSettings = true" class="ml-2" />
                    </div>


                        <ModalSearchResult v-for="game in results" key="game.bgg_game_id" :game="game" @added="added" />
                        <p v-if="searched && !results.length">No results.</p>

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
                            <Checkbox class="form-check-input" type="checkbox" v-model="exact" id="cbExact"
                                :binary="true" />
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

                <ProgressSpinner class="fixed inset-0 flex items-center justify-center" v-show="loading" />

            </div>
        </div>
    </transition>
</template>

<script setup>
import { debounce } from 'debounce'
import { user, currentCollection, gamesMap } from '~/composables/useGames'

const showSettings = ref(false)
const searched = ref(false)
const results = ref([])
const exact = ref(false)
const limit = ref(10)
const limits = [10, 25, 50]
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
        $fetch('/api/bgg/search', {
            method: 'get',
            params: {
                text: queryText.value.trim(),
                type: boardgameVsExpansion.value,
                exact: exact.value,
                limit: limit.value
            }
        }).then(res => {
            results.value = res.map(game => {
                game.owns = gamesMap.value.has(parseInt(game.bgg_game_id))
                return game
            }).sort((a, b) => 10 * (b.owns - a.owns) + (b.ratingVotes - a.ratingVotes))
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

<style lang="scss" scoped />