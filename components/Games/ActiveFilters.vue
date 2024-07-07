


<template>
    <div id="active-tags">
        
        <GamesFilteringChip v-for="(item, name) in filters" :index="item" :field="name" class="chip active-filter" />

        <Chip v-for="tag in filteredTags" :key="tag.id" :label="tag.name" removable class="chip selected-tag"
            @click="clickedTag(tag)" />

        <Chip v-if="anyFilters" removable label="Clear All" @click="clearAllFilters()" />
    </div>
</template>

<script setup>
import { filters, filteredTags, clickedTag, clearAllFilters } from '~/composables/useGames'

const anyFilters = computed(() => {
    return  (filteredTags.value.length > 0) || Object.entries(filters.value).some(f => f[1].active)
})
</script>

<style lang="scss" scoped>

#active-tags {
    min-height: 32px;
    margin-top: 5px;
}

.chip {
    margin-top: 0.25rem;
    margin-right: 0.25rem;
    cursor: pointer;
}

.active-filter {
    background-color: darkmagenta;
}

.selected-tag {
    background-color: darkcyan;
}

</style>