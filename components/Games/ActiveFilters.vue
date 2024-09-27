<template>
    <div class="text-sm !h-[7rem] overflow-y-scroll bg-slate-100 rounded chip-holder">
        <div class="flex flex-col items-center">
            <span>Current filters<span v-show="numActiveFilters > 0"> ({{ numActiveFilters }})</span>:</span>
            <span v-if="!numActiveFilters">none.</span>
        </div>

        <Chip v-if="numActiveFilters" class="chip !bg-slate-600" removable label="Clear All"
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
    border: 2px outset var(--p-surface-200);
}

.selected-tag {
    background-color: darkcyan;
}

.chip-holder {
    border: 2px inset var(--p-surface-200);
}
</style>