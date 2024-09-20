<template>
    <div class="flex flex-col justify-center items-center">
        Game length:
        <div class="m-2">
            <SelectButton v-model="gameLength" :options="gameLengthOptions" optionLabel="name"
                @update:modelValue="updateLength"/>
        </div>
        Number of Players:
        <div v-for="y in [0, 1, 2]" class="flex justify-center my-2">
            <Button v-for="x in [1, 2, 3]" severity="info" class="w-12 m-2" :outlined="(numPlayers == (y * 3 + x))"
                :label="(y * 3 + x).toString()" @click="updateNumPlayers((y * 3 + x))" />
        </div>
        <Button class="w-12 my-2" severity="info" :outlined="numPlayers == '10+'" label="10+" @click="updateNumPlayers(10)" />
        <div class="text-center px-8" v-show="showText">
            Showing <b class="bg-highlight">{{ gameLengthText }}</b> games
            <b class="bg-highlight">{{ numPlayersText }}</b>
        </div>
    </div>
</template>

<script setup>
import { setSlider, limits, filters, numPlayers, gameLength } from '~/composables/useGames'

// Game Length Stuff
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

const numPlayersText = ref('')

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
    if (newNumPlayers === numPlayers.value || (newNumPlayers === 10 && numPlayers.value === '10+')) {
        clearSlider('players')
        resetPlayers()
        numPlayers.value = null
    } else if (newNumPlayers === 10) {
        numPlayers.value = '10+'
        setSlider('players', 0, 10)
        setSlider('players', 1, limits.players[1])
        numPlayersText.value = ' for 10 or more players'
    } else {
        numPlayers.value = newNumPlayers
        setSlider('players', 0, newNumPlayers)
        setSlider('players', 1, newNumPlayers)
        numPlayersText.value = ' for ' + newNumPlayers + ' player' + pl(newNumPlayers)
    }
}


const showText = computed(() => {
    return gameLength.value !== null || numPlayers.value !== null
})

</script>