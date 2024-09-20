<template>
    <div class="text-sm min-h-20 overflow-y-scroll">
        <div class="flex flex-col items-center">
            <span>Current filters:</span>
            <span v-if="!numActiveFilters">none.</span>
        </div>

        <Chip v-if="numActiveFilters" class="chip bg-slate-600" removable label="Clear All"
            @click="clearAllFilters()" />

        <GamesFilteringChip v-for="(item, name) in filters" :index="item" :field="name"
            class="chip !bg-purple-700 text-white" />

        <Chip v-for="tag in filteredTags" :key="tag.id" :label="tag.name" removable
            class="chip bg-surface-700 text-white" @click="clickedTag(tag)" />

        <Chip v-if="searchTerm.trim().length > 1" class="chip bg-green-800" removable :label="searchLabel"
            @click="searchTerm = ''" />
    </div>
</template>

<script setup>
import { filters, filteredTags, clickedTag, clearAllFilters, numActiveFilters, searchTerm } from '~/composables/useGames'

const searchLabel = computed(() => {
    return `contains "${searchTerm.value}"`
})
</script>

<style lang="scss" scoped>
.chip {
    margin: .25rem;
    cursor: pointer;
    color: white;
}

.selected-tag {
    background-color: darkcyan;
}
</style>