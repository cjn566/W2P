<template>
    <tr v-if="!game.expanded">
        <td>
            <img class="thumbnail" :src="game.thumbnail" alt="" loading="lazy">
            <button v-if="editingGames" @click.stop="deleteSelf">Delete</button>
        </td>
        <td>
            <GamesLink :game="game" />
        </td>
        <td>{{ game.rank }}</td>
        <td>{{ game.rating }}</td>
        <td>{{ game.complexity }}</td>
        <td>
            {{ game.playersMin == game.playersMax ? game.playersMin : `${game.playersMin} - ${game.playersMax}` }}
        </td>
        <td>{{ formatPlaytime }}</td>
        <td>{{ game.minage }}y</td>
        <td>{{ game.publishyear }}</td>
    </tr>
    <tr v-else>
        <td colspan="9" class="card__row">
            <div class="card__container">
                <div class="card">
                    <div class="card__image-and-stats">
                        <img class="card__image" :src="game.image" alt="" loading="lazy">
                        <div class="card__values__column">
                            <p>
                                <GamesLink :game="game" /> ({{ game.publishyear }})
                            </p>
                            <p>Rank: {{ game.rank }}</p>
                            <p>Rating: {{ game.rating }}</p>
                            <p>Weight: {{ game.complexity }} / 5</p>
                        </div>
                        <div class="card__values_column">
                            <p>Age: {{ game.minage }}+</p>
                            <p>{{ formatPlayers }} players</p>
                            <p>{{ formatPlaytime }}</p>
                        </div>
                    </div>
                    <p class="card__description">{{ game.description }}</p>
                </div>
            </div>
        </td>
    </tr>
</template>

<script setup>
import { useState } from 'nuxt/app';

const props = defineProps(['game'])

const editingGames = useState('editingGames')

const formatPlaytime = computed(() => {
    let ret = formatHrs(props.game.minplaytime)
    if (props.game.minplaytime != props.game.maxplaytime) {
        ret += ' - ' + formatHrs(props.game.maxplaytime)
    }
    return ret
})

function formatHrs(minutes) {
    let hours = Math.floor(minutes / 60)
    if (hours) {
        hours += Math.round((minutes % 60) / 15) * 0.25
        return hours + 'hr'
    } else {
        return minutes + 'm'
    }
}

const formatPlayers = computed(() => {
    return props.game.minplayers == props.game.maxplayers ? props.game.minplayers : `${props.game.minplayers} - ${props.game.maxplayers}`
})
const mechanics = computed(() => {
    return props.game.tags.filter(tag => { return tag.type == "boardgamemechanic" })
})
const categories = computed(() => {
    return props.game.tags.filter(tag => { return tag.type == "boardgamecategory" })
})

async function deleteSelf() {
    if (confirm(`Are you sure you want to remove "${props.game.name}" from your library?`)) {
        const res = (await useFetch('/api/collection/remove?id=' + props.game.userGameId)).data.value
        if (res.err) {
            console.error(res.msg)
        } else {
            const allGames = useState('games')
            const idx = allGames.value.findIndex(game => game.userGameId == props.game.userGameId)
            if(idx >= 0){
                allGames.value.splice(idx, 1)
            } else {
                console.error("Game not found in state for deletion")
            }
        }
    }
}




</script>

<style scoped>
.thumbnail {
    height: 30px;
    width: 30px;
    object-fit: contain;
}

.card__row {
    padding: 0;
}

.card__container {
    width: 100vw;
    padding: .5rem;
}

.card {
    background-color: azure;
}

.card__image-and-stats {
    display: flex;
}

.card__values__column {

    flex-grow: 1;
}

.card__image {
    width: 25vw;
    object-fit: contain;
    margin: 10px;
    align-self: center;
}

.card__description {
    padding: 1em;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
}
</style>