


<template>
    <div id="active-tags">
        
        <GamesFilteringChip v-for="(item, name) in indices" :index="item.current" :field="name" />

        <Chip v-for="tag in filteredTags" :key="tag.id" :label="tag.name" removable class="selected-tag active"
            @click="clickedTag(tag)" />
    </div>
</template>

<script setup>
import { indices, filteredTags } from '~/composables/useGames'
import {  clickedTag } from '~/composables/useTags'
</script>

<style lang="scss" scoped>
</style>