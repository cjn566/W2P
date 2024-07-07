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
import { setSlider, limits, filters } from '~/composables/useGames'

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

watch(() => filters.value.playtime.active, (isActive) => {
    if(!isActive){
        gameLength.value = null
        resetLength()
    }
})

function resetLength(){
    gameLengthText.value = ''
}

const updateLength = (newLength) => {
    if (newLength === null) {
        clearSlider('playtime')
        resetLength()
    } else {
        switch (newLength.value) {
            case 1:
                setSlider('playtime', 0, limits.playtime[0])
                setSlider('playtime', 1, 15)
                gameLengthText.value = 'fast'
                break
            case 2:
                setSlider('playtime', 0, 16)
                setSlider('playtime', 1, 60)
                gameLengthText.value = 'medium length'
                break
            case 3:
                setSlider('playtime', 0, 61)
                setSlider('playtime', 1, limits.playtime[1])
                gameLengthText.value = 'long'
                break
        }
    }
}

watch(() => filters.value.players.active, (isActive) => {
    if(!isActive){
        numPlayers.value = null
        resetPlayers()
    }
})

function resetPlayers(){
    numPlayersText.value = ''
}

const updateNumPlayers = (newNumPlayers) => {
    if (newNumPlayers === null) {
        clearSlider('players')
        resetPlayers()
    } else if (newNumPlayers.value === 9) {
        setSlider('players', 0, 9)
        setSlider('players', 1, limits.players[1])
        numPlayersText.value = ' for 9+ players'
    } else {
        setSlider('players', 0, newNumPlayers.value)
        setSlider('players', 1, newNumPlayers.value)
        numPlayersText.value = ' for ' + newNumPlayers.name + ' player' + (newNumPlayers.value > 1 ? 's' : '')
    }
}


const showText = computed(() => {
    return gameLength.value !== null || numPlayers.value !== null
})

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