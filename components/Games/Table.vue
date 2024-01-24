<template>
    <div>
        <DataTable :value="props.displayGames" dataKey="userGameId" lazy paginator :rows="10" showGridlines stripedRows scrollable scroll-height="90vh"
            :default-sort-order="-1"
            class="game-table" size="large" @update:sortOrder="(order) => {sortOrder = order}">

            <template #header>
                <!-- Showing {{ displayGames.length }} of {{ games.length }} games.
                
                <div class="flex justify-content-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <Button type="button" icon="pi pi-filter-slash" label="Change" outlined @click="sortGames()" />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                    </span>
                </div> -->
            </template>

            <!-- Game -->
            <Column sortable sort-field="name" frozen>
                <template #header>
                    <font-awesome-icon :icon="['fas', 'chess-board']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <img class="row-thumbnail" :alt="data.name" :src="data.thumbnail" style="height=20px" />
                        {{ data.name }}
                    </div>
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder" />
                </template>
            </Column>

            <!-- Rating -->
            <Column field="rating" sortable sort-field="rating">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'star']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    {{ data.rating > 0.1 ? data.rating : "n/a" }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder" />
                </template>
            </Column>

            <!-- complexity -->
            <Column field="complexity" sortable sortField="complexity">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'brain']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    {{ data.complexity > 0.1 ? data.complexity : "n/a" }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder" />
                </template>
            </Column>

            <!-- Players -->
            <Column sortable :sortField="sortPlayers">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'people-group']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    {{ formatPlayers(data) }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder" />
                </template>
            </Column>

            <!-- Play Time  -->
            <Column sortable :sort-field="sortPlaytime">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'clock']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    {{ formatPlaytime(data) }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder" />
                </template>
            </Column>

            <!-- Age -->
            <Column sortable sortField="age">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'person-cane']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    {{ data.age ? data.age + "y" : "n/a" }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder" />
                </template>
            </Column>

            <!-- Year Published -->
            <Column field="year" sortable>
                <template #header>
                    <font-awesome-icon :icon="['fas', 'calendar']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    {{ data.year ? data.year : "n/a" }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder" />
                </template>
            </Column>

        </DataTable>
    </div>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Row from 'primevue/row'                   // optional

const props = defineProps(['displayGames'])

let sortOrder = 0

const sortPlayers = (game) => {
    if(sortOrder > 0){
        return game.playersMin + (game.playersMax / 100)
    } else {
        return game.playersMax  + (game.playersMin / 100)
    }
}
const sortPlaytime = (game) => {
    if(sortOrder > 0){
        return game.playtimeMin + (game.playtimeMax / 1000)
    } else {
        return game.playtimeMax  + (game.playtimeMin / 1000)
    }
}

const formatPlayers = (game) => {
    return game.playersMin == game.playersMax ? game.playersMin : `${game.playersMin} - ${game.playersMax}`
}

const formatPlaytime = (game) => {
    if(!game.playtimeMin) return 'n/a'
    return game.playtimeMin == game.playtimeMax ? game.playtimeMin + 'm' : `${game.playtimeMin} - ${game.playtimeMax}m`
}



</script>

<style>
.p-column-header-content {
    justify-content: center;
}

.row-thumbnail {
    max-width: 15vw;
    object-fit: contain;
    margin-right: 5px;
}

.game-table {
    font-size: x-small;
}

.game-tag {
    margin: 2px
}
</style>