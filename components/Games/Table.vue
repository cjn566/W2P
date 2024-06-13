<template>
    <div>
        <DataTable :value="filteredGames" dataKey="userGameId" showGridlines stripedRows scrollable scroll-height="90vh"
            class="game-table" size="large">

            <!-- Game -->
            <Column frozen>
                <template #header>
                    <font-awesome-icon :icon="['fas', 'chess-board']" style="color: #0058f0;" size="2x" @click="sortBy('name')"/>
                </template>
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        {{ data.name }}
                    </div>
                </template>
            </Column>

            <!-- Rating -->
            <Column field="rating" >
                <template #header>
                    <font-awesome-icon :icon="['fas', 'star']" style="color: #0058f0;" size="2x" @click="sortBy('rating')"/>
                </template>
                <template #body="{ data }">
                    {{ data.display.rating }}
                </template>
            </Column>

            <!-- complexity -->
            <Column field="complexity" >
                <template #header>
                    <font-awesome-icon :icon="['fas', 'brain']" style="color: #0058f0;" size="2x" @click="sortBy('complexity')" />
                </template>
                <template #body="{ data }">
                    {{ data.display.complexity }}
                </template>
            </Column>

            <!-- Players -->
            <Column >
                <template #header>
                    <font-awesome-icon :icon="['fas', 'people-group']" style="color: #0058f0;" size="2x" @click="sortBy('players')"/>
                </template>
                <template #body="{ data }">
                    {{ data.display.players }}
                </template>
            </Column>

            <!-- Play Time  -->
            <Column >
                <template #header>
                    <font-awesome-icon :icon="['fas', 'hourglass-half']" style="color: #0058f0;" size="2x"  @click="sortBy('playtime')"/>
                </template>
                <template #body="{ data }">
                    {{ data.display.playtime }}
                </template>
            </Column>

            <!-- Age -->
            <Column>
                <template #header>
                    <font-awesome-icon :icon="['fas', 'person-cane']" style="color: #0058f0;" size="2x" @click="sortBy('age')"/>
                </template>
                <template #body="{ data }">
                    {{ data.display.age }}
                </template>
            </Column>

            <!-- Year Published -->
            <Column field="year">
                <template #header>
                    <font-awesome-icon :icon="['fas', 'calendar']" style="color: #0058f0;" size="2x" @click="sortBy('year')"/>
                </template>
                <template #body="{ data }">
                    {{ data.display.year }}
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
import { filteredGames, sortBy, sorting } from '~/composables/useGames'

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
    font-size: small;
    margin-top: 1rem;
}

.game-tag {
    margin: 2px
}
</style>