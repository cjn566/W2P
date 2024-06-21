<template>
    <div class="simple-container">
        Game length:
        <div class="btn-set">
            <SelectButton v-model="gameLength" :options="gameLengthOptions" optionLabel="name"
                @update:modelValue="updateLength" />
        </div>
        Players:
        <div class="btn-set">
            <SelectButton v-model="numPlayers" :options="numPlayersOptions" optionLabel="name"
                @update:modelValue="updateNumPlayers" />
        </div>
        <div id="display-text-container">
            <p :class="{ 'hide-text': !showText }">Showing <b class="highlight">{{ gameLengthText }}</b> games<b
                    class="highlight">{{
                numPlayersText }}</b>:</p>
        </div>
    </div>
</template>

<script setup>
import { commitSliderValues, limits } from '~/composables/useGames'

const gameLength = ref(null)
const gameLengthText = ref('')
const gameLengthOptions = ref([
    { name: 'Fast', value: 1 },
    { name: 'Medium', value: 2 },
    { name: 'Long', value: 3 }
])

const numPlayers = ref(null)
const numPlayersText = ref('')
const numPlayersOptions = ref([
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9+', value: 9 }
])

const updateLength = (newLength) => {
    if (newLength === null) {
        commitSliderValues('playtime', null)
        gameLengthText.value = ''
    } else {
        switch (newLength.value) {
            case 1:
                commitSliderValues('playtime', [limits.playtime[0], 15])
                gameLengthText.value = 'fast'
                break
            case 2:
                commitSliderValues('playtime', [16, 60])
                gameLengthText.value = 'medium length'
                break
            case 3:
                commitSliderValues('playtime', [61, limits.playtime[1]])
                gameLengthText.value = 'long'
                break
        }
    }
}

const updateNumPlayers = (newNumPlayers) => {
    if (newNumPlayers === null) {
        commitSliderValues('players', null)
        numPlayersText.value = ''
    } else if (newNumPlayers.value === 9) {
        commitSliderValues('players', [9, limits.players[1]])
        numPlayersText.value = ' for 9+ players'
    } else {
        commitSliderValues('players', [newNumPlayers.value, newNumPlayers.value])
        numPlayersText.value = ' for ' + newNumPlayers.name + ' player' + (newNumPlayers.value > 1 ? 's' : '')
    }
}


const showText = computed(() => {
    return gameLength.value !== null || numPlayers.value !== null
})

function clickButton(setting, idx) {
    switch (setting) {
        case 'time':
            settings.value.time.active = idx
            switch (idx) {
                case 1:
                    commitSliderValues('playtime', [limits.playtime[0], 15])
                    break
                case 2:
                    commitSliderValues('playtime', [15, 60])
                    break
                case 3:
                    commitSliderValues('playtime', [60, limits.playtime[1]])
                    break
                case 0:
                    commitSliderValues('playtime', [limits.playtime[0], limits.playtime[1]])
                    panel.value = 'none'
                    break
            }
            break
        case 'players':
            settings.value.players.active = idx
            switch (idx) {
                case 1:
                    commitSliderValues('players', [1, 1])
                    break
                case 2:
                    commitSliderValues('players', [2, 2])
                    break
                case 3:
                    commitSliderValues('players', [3, 20])
                    break
                case 0:
                    commitSliderValues('playtime', [limits.players[0], limits.players[1]])
                    panel.value = 'none'
                    break
            }
            break

    }
}

</script>


<style lang="scss" scoped>
.simple-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}

.btn-set {
    margin: 0.5rem;
}

.active {
    border: 3px solid gold;
}

.hide-text {
    visibility: hidden;
}

#display-text-container {
    display: flex;
    justify-content: center;
    padding-bottom: 0;
    margin-bottom: 0;
}

.highlight {
    color: gold;
}
</style>