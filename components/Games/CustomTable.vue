<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Game</th>
                    <th>Rating</th>
                    <th>Complexity</th>
                    <th>Players</th>
                    <th>Play Time</th>
                    <th>Age</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="game in filteredGames" :key="game.id">
                    <td>
                        <img :src="game.thumbnail" class="row-thumbnail" />
                        <span>{{ game.name }}</span>
                        <div v-for="tag in game.tags" :key="tag" class="game-tag">{{ tag }}</div>
                    </td>
                    <td>{{ game.display.rating }}</td>
                    <td>{{ game.display.complexity }}</td>
                    <td>{{ game.display.players }}</td>
                    <td>{{ game.display.playtime }}</td>
                    <td>{{ game.display.age }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { filteredGames, sortBy, sorting } from '~/composables/useGames'

</script>

<style lang="scss" scoped>
.p-column-header-content {
    justify-content: center;
}

.row-thumbnail {
    max-width: 15vw;
    object-fit: contain;
    margin-right: 5px;
}

.game-table {
    font-size: small;
    margin-top: 1rem;
}

.game-tag {
    margin: 2px
}
</style>