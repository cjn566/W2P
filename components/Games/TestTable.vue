<template>
    <div>
        <GamesFilter />
        <DataTable :value="displayGames" dataKey="userGameId" showGridlines stripedRows scrollable scroll-height="90vh"
            :default-sort-order="-1"
            class="game-table" size="large" @update:sortOrder="(order) => {sortOrder = order}">

            <template #header>
                Showing {{ displayGames.length }} of {{ boop.games.length }} games.
                <!-- 
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
            <Column field="publishyear" sortable>
                <template #header>
                    <font-awesome-icon :icon="['fas', 'calendar']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    {{ data.publishyear ? data.publishyear : "n/a" }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder" />
                </template>
            </Column>



            <!-- Tags -->
            <Column>
                <template #header>
                    <font-awesome-icon :icon="['fas', 'calendar']" style="color: #0058f0;" size="2x" />
                </template>
                <template #body="{ data }">
                    <Tag v-for="tag in data.tags" :value='tag.value' class="game-tag"></Tag>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import boop from '~/composables/useGames'
import blankFilters from './filters'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag'
import Row from 'primevue/row';                   // optional


const filters = useState('filters', blankFilters)

const displayGames = computed(()=>{
    if(!filters.value.areSet) return boop.games.value
    return boop.games.value.filter((game) =>{
        if(filters.value.rating       && game.rating          < filters.value.rating)       return false
        if(filters.value.complexity[0] > 0 && game.complexity      < filters.value.complexity[0]) return false
        if(filters.value.complexity[1] < 5 && game.complexity      > filters.value.complexity[1]) return false
        if(filters.value.players      && (game.players.min    > filters.value.players 
                                || game.players.max     < filters.value.players))     return false
        if(filters.value.time[0]       && game.playtime.min    < filters.value.time[0])       return false
        if(filters.value.time[1]       && game.playtime.max    > filters.value.time[1])       return false
        if(filters.value.age[0]        && game.age             < filters.value.age[0])        return false
        if(filters.value.age[1]        && game.age             > filters.value.age[1])        return false
        if(filters.value.year[0]       && game.publishyear     < filters.value.year[0])       return false
        if(filters.value.year[1]       && game.publishyear     > filters.value.year[1])       return false
        return true
    })
})

let sortOrder = 0

const sortPlayers = (game) => {
    if(sortOrder > 0){
        return game.players.min + (game.players.max / 100)
    } else {
        return game.players.max  + (game.players.min / 100)
    }
}
const sortPlaytime = (game) => {
    if(sortOrder > 0){
        return game.playtime.min + (game.playtime.max / 1000)
    } else {
        return game.playtime.max  + (game.playtime.min / 1000)
    }
}

const formatPlayers = (game) => {
    return game.players.min == game.players.max ? game.players.min : `${game.players.min} - ${game.players.max}`
}

const formatPlaytime = (game) => {
    if(!game.playtime.min) return 'n/a'
    return game.playtime.min == game.playtime.max ? game.playtime.min + 'm' : `${game.playtime.min} - ${game.playtime.max}m`
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