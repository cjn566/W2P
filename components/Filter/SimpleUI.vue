<template>
    <div>
        <Divider />
        <div v-if="panel == 'time'">
            <header>Time:</header>
            <div class="panel">
                <Button :class="settings.time.active == 1 ? 'active' : ''" @click="clickButton('time', 1)">Fast</Button>
                <Button :class="settings.time.active == 2 ? 'active' : ''" @click="clickButton('time', 2)">Medium
                    Length</Button>
                <Button :class="settings.time.active == 3 ? 'active' : ''" @click="clickButton('time', 3)">Long</Button>
                <Button :class="settings.time.active == 0 ? 'active' : ''" @click="clickButton('time', 0)">
                    <font-awesome-icon :icon="['fas', 'filter-circle-xmark']" style="color: #ffffff;" />
                </Button>
            </div>
        </div>
        <div v-else @click="panel = 'time'" class="summary">
            <p>{{ settings.time.descriptions[settings.time.active] }}</p>
        </div>
        <Divider />
        <div v-if="panel == 'players'">
            <header>Time:</header>
            <div class="panel">
                <Button :class="settings.players.active == 1 ? 'active' : ''" @click="clickButton('players', 1)">1</Button>
                <Button :class="settings.players.active == 2 ? 'active' : ''" @click="clickButton('players', 2)">2</Button>
                <Button :class="settings.players.active == 3 ? 'active' : ''" @click="clickButton('players', 3)">3+</Button>
                <Button @click="clickButton('players', 0)">
                    <font-awesome-icon :icon="['fas', 'filter-circle-xmark']" style="color: #ffffff;" />
                </Button>
            </div>
        </div>
        <div v-else @click="panel = 'players'" class="summary">
            <p>{{ settings.players.descriptions[settings.players.active] }}</p>
        </div>
        <Divider />
        <Divider />
        <Divider />
    </div>
</template>

<script setup>
import Divider from 'primevue/divider'
import { commitSliderValues, limits } from '~/composables/useGames'

const panel = ref('none')
const settings = ref({
    time: {
        active: 0,
        descriptions: [
            "any amount of time",
            "fast",
            "medium length",
            "long"
        ]
    },
    players: {
        active: 0,
        descriptions: [
            "any number of players",
            "one",
            "two",
            "three or more"
        ]
    }
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

<style scoped>
.panel {
    display: flex;
}

Button {
    margin: 2px;
    border-radius: 3px;
}

.active {
    border: 3px solid gold;
}
</style>