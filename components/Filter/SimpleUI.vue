<template>
    <div class="flex flex-col justify-center items-center">
        Game length:
        <div class="m-2">
            <SelectButton v-model="gameLength" :options="gameLengthOptions" optionLabel="name"
                @update:modelValue="updateLength" />
        </div>
        Players:
        <div class="m-2">
            <SelectButton v-model="numPlayers" :options="numPlayersOptions" optionLabel="name"
                @update:modelValue="updateNumPlayers" />
            <Button v-for="n in [1,2,3,4,5,6,7,8,'9+']" :label="n" @click="updateNumPlayers"/>
        </div>
        <div id="display-text-container">
            <div v-show="showText">
                Showing <b class="bg-highlight">{{ gameLengthText }}</b> games
                <b class="highlight">{{ numPlayersText }}</b>
            </div>
        </div>
    </div>
</template>

<script setup>
import { setSlider, limits, filters } from '~/composables/useGames'

// Game Length Stuff
const gameLength = ref(null)
const gameLengthText = ref('')
const gameLengthOptions = ref([
    { name: 'Fast', value: 1 },
    { name: 'Medium', value: 2 },
    { name: 'Long', value: 3 }
])

watch(() => filters.value.playtime.active, (isActive) => {
    if (!isActive) {
        gameLength.value = null
        resetLength()
    }
})

function resetLength() {
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

// Num Players Stuff
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

watch(() => filters.value.players.active, (isActive) => {
    if (!isActive) {
        numPlayers.value = null
        resetPlayers()
    }
})

function resetPlayers() {
    numPlayersText.value = ''
}

const updateNumPlayers = (newNumPlayers) => {
    console.log(newNumPlayers)
    return
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
        numPlayersText.value = ' for ' + newNumPlayers.name + ' player' + pl(newNumPlayers.value)
    }
}


const showText = computed(() => {
    return gameLength.value !== null || numPlayers.value !== null
})

</script>


<style lang="scss" scoped>
.active {
    border: 3px solid gold;
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