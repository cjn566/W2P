<template>
    <div>
        <DataTable :value="filteredGames" dataKey="userGameId" lazy showGridlines stripedRows scrollable
            scroll-height="90vh" class="game-table" size="large">

            <Column v-if="editingGames" selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <!-- Game -->
            <Column frozen>
                <template #header>
                    <div class="header-btn" @click="sortBy('name')">
                        <font-awesome-icon :icon="['fas', 'arrow-down-a-z']" size="2x" class="header-icon" />
                    </div>
                </template>
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        {{ data.name }}
                    </div>
                </template>
            </Column>

            <!-- Rating -->
            <Column field="rating">
                <template #header>
                    <div class="header-btn" @click="sortBy('rating')">
                        <font-awesome-icon :icon="['fas', 'star']" size="2x" class="header-icon" />
                    </div>
                </template>
                <template #body="{ data }">
                    {{ data.display.rating }}
                </template>
            </Column>

            <!-- complexity -->
            <Column field="complexity">
                <template #header>
                    
                    <div class="header-btn" @click="sortBy('complexity')">
                        <font-awesome-icon :icon="['fas', 'brain']" size="2x" class="header-icon" />
                    </div>
                </template>
                <template #body="{ data }">
                    {{ data.display.complexity }}
                </template>
            </Column>

            <!-- Players -->
            <Column>
                <template #header>
                    
                    <div class="header-btn" @click="sortBy('players')">
                        <font-awesome-icon :icon="['fas', 'people-group']" size="2x" class="header-icon" />
                    </div>
                </template>
                <template #body="{ data }">
                    {{ data.display.players }}
                </template>
            </Column>

            <!-- Play Time  -->
            <Column>
                <template #header>
                    
                    <div class="header-btn" @click="sortBy('playtime')">
                        <font-awesome-icon :icon="['fas', 'hourglass-half']" size="2x" class="header-icon" />
                    </div>
                </template>
                <template #body="{ data }">
                    {{ data.display.playtime }}
                </template>
            </Column>

            <!-- Age -->
            <Column>
                <template #header>
                    <div class="header-btn" @click="sortBy('age')">
                        <font-awesome-icon :icon="['fas', 'person-cane']" size="2x" class="header-icon" />
                    </div>
                </template>
                <template #body="{ data }">
                    {{ data.display.age }}
                </template>
            </Column>

            <!-- Year Published -->
            <Column field="year">
                <template #header>
                    
                    <div class="header-btn" @click="sortBy('year')">
                        <font-awesome-icon :icon="['fas', 'calendar']" size="2x" class="header-icon" />
                    </div>
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
import Column from 'primevue/column'             // optional
import { editingGames, filteredGames, sortBy } from '~/composables/useGames'

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

.header-btn {
    :hover {
        cursor: pointer;
    }
}

.header-icon {
    color: #0058f0;
}

</style>