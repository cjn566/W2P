<template>
    <div class="card">
        <DataTable :value="displayGames" dataKey="userGameId" paginator v-model:expandedRows="expandedRows"
            :rows="20" class="p-datatable-sm game-table" size="small" :globalFilterFields="['name']">
            <template #header>
                <div class="flex justify-content-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <Button type="button" icon="pi pi-filter-slash" label="Sort" outlined @click="sortGames()" />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Search for Game" />
                    </span>
                </div>
            </template>
            <template #empty> There are no games in this library. </template>

            <template #expansion="slotProps">
                    <div class="card__container">
                        <div class="card">
                            <div class="card__image-and-stats">
                                <img class="card__image" :src="slotProps.data.image" alt="" loading="lazy">
                                <div class="card__values__column">
                                    <p>
                                        <GamesLink :game="slotProps.data" /> ({{ slotProps.data.publishyear }})
                                    </p>
                                    <p>Rank: {{ slotProps.data.rank }}</p>
                                    <p>Rating: {{ slotProps.data.rating }}</p>
                                    <p>Weight: {{ slotProps.data.complexity }} / 5</p>
                                </div>
                                <div class="card__values_column">
                                    <p>Age: {{ slotProps.data.minage }}+</p>
                                    <p>{{ formatPlayers }} players</p>
                                    <p>{{ formatPlaytime }}</p>
                                </div>
                            </div>
                            <p class="card__description">{{ slotProps.data.description }}</p>
                        </div>
                    </div>
            </template>

            <!-- Game name -->
            <Column sortable sort-field="name">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'chess-board']" style="color: #0058f0;" size="2x"/>
                </template>
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <img class="row-thumbnail" :alt="data.name" :src="data.thumbnail" style="height=20px" />
                        <span>{{ data.name }}</span>
                    </div>
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder"/>
                </template>
            </Column>

            <Column sortable sortField="rating" filterField="rating" :filterMenuStyle="{ width: '14rem' }">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'star']" style="color: #0058f0;" size="2x"/>
                </template>
                <template #body="{ data }">
                    {{ data.rating > 0.1 ? data.rating : "N/A" }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder"/>
                </template>
            </Column>

            <Column field="complexity" sortable sortField="complexity" filterField="complexity"
                :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }">
                                
                <template #header>
                    <font-awesome-icon :icon="['fas', 'brain']" style="color: #0058f0;" size="2x"/>
                </template>
                <template #body="{ data }">
                    {{ data.complexity > 0.1 ? data.complexity : "N/A" }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder"/>
                </template>
            </Column>

            <Column sortable filterField="players" :filterMenuStyle="{ width: '14rem' }">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'people-group']" style="color: #0058f0;" size="2x"/>
                </template>
                <template #body="{ data }">
                    {{ formatPlayers(data) }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder"/>
                </template>
            </Column>

            <Column sortable sortField="rank" filterField="playtime" :filterMenuStyle="{ width: '14rem' }">
                
                <template #header>
                    <font-awesome-icon :icon="['fas', 'clock']" style="color: #0058f0;" size="2x"/>
                </template>
                <template #body="{ data }">
                    {{ formatPlaytime(data) }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder"/>
                </template>
            </Column>

            <Column sortable sortField="age" filterField="age" :filterMenuStyle="{ width: '14rem' }">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'person-cane']" style="color: #0058f0;" size="2x"/>
                </template>
                <template #body="{ data }">
                    {{ data.age }}y
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder"/>
                </template>
            </Column>

            <Column field="publishyear" sortable filterField="year" :filterMenuStyle="{ width: '14rem' }">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'calendar']" style="color: #0058f0;" size="2x"/>
                </template>
                <template #body="{ data }">
                    {{ data.publishyear ? data.publishyear : "N/A" }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <GamesSortIcon :order="sortOrder"/>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { FilterMatchMode } from 'primevue/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { PrimeIcons } from 'primevue/api'
import Row from 'primevue/row';                   // optional

let sortOrder = true
const sortGames = (event) => {
    displayGames.value.sort((a, b) => {
        if (sortOrder) {
            return a.name - b.name
        } else {
            return b.name - a.name
        }
    })
    sortOrder = !sortOrder
}

const games = useState('games')

const displayGames = ref(games)
const expandedRows = ref([])



const filters = ref();

const initFilters = () => {
    filters.value = {
        global: {
            value: null, matchMode: FilterMatchMode.CONTAINS
        },
        complexity: {
            value: [0, 5],
            matchMode: FilterMatchMode.BETWEEN
        },
        rating: {
            value: null,
            matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
        },
        players: {
            value: null,
            matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
        },
        // playtime: {
        //     value: [0, 500],  // TODO: get longest max playtime
        //     matchMode: FilterMatchMode.BETWEEN
        // },
        age: {
            value: null,
            matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
        },
        year: {
            value: null,
            matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
        }
    };
}

initFilters();

const clearFilter = () => {
    initFilters();
}

const formatPlayers = (game) => {
    return game.players.min == game.players.max ? game.players.min : `${game.players.min} - ${game.players.max}`
}

const formatPlaytime = (game) => {
    let ret = formatHrs(game.playtime.min)
    if (game.playtime.min != game.playtime.max) {
        ret += ' - ' + formatHrs(game.playtime.max)
    }
    return ret
}

function formatHrs(minutes) {
    let hours = Math.floor(minutes / 60)
    if (hours) {
        hours += Math.round((minutes % 60) / 15) * 0.25
        return hours + 'hr'
    } else {
        return minutes + 'm'
    }
}



</script>
<style>
.p-column-header-content {
    justify-content: center;
}

.game-table {
    font-size: x-small;
    word-wrap: break-word;
    size: small
}

.row-thumbnail {
    max-width: 5vw;
    object-fit: contain;
    margin-right: 5px;
}

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
<!-- 
<template>
    <div class="card">
        <DataTable :value="games" tableStyle="min-width: 50rem" stripedRows="">
            <Column v-for="header of headers" :key="header.field" :field="header.field" :header="header.header"></Column>
        </DataTable>
    </div>
</template>

<script setup>
const games = useState('games')
import headers from './headers'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'   // optional
import Row from 'primevue/row'                   // optional

const displayGames = computed(()=>{
    return games.value.filter(g => !g.hide)
})

function rowClicked(gameId) {
    const openGame = games.value.find(game => game.expanded)
    if (openGame) {
        openGame.expanded = false
        if (openGame.id == gameId) return
    }
    games.value.find(game => game.id == gameId).expanded = true
}


</script>

<style scoped>
.table {
    font-size: xx-small;
    table-layout: fixed;
}

th {
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
}
</style> -->