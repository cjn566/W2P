


<template>
    <div class="text-sm bg-slate-300 rounded-lg min-h-16">
        
        <GamesFilteringChip v-for="(item, name) in filters" :index="item" :field="name" class="chip active-filter" />

        <Chip v-for="tag in filteredTags" :key="tag.id" :label="tag.name" removable class="chip selected-tag"
            @click="clickedTag(tag)" />

        <Chip v-if="numActiveFilters" class="chip" removable label="Clear All" @click="clearAllFilters()" />
    </div>
</template>

<script setup>
import { filters, filteredTags, clickedTag, clearAllFilters, numActiveFilters} from '~/composables/useGames'
</script>

<style lang="scss" scoped>


.chip {
    margin: .25rem;
    cursor: pointer;
}

.active-filter {
    background-color: darkmagenta;
    color:white;
}

.selected-tag {
    background-color: darkcyan;
}

</style>