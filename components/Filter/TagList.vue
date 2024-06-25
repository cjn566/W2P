<template>
    <div id="tags-container">
        <div id="header">
            <SelectButton v-model="sort" :options="sortOptions" :pt="{ root: 'btn-sort' }">
                <template #option="slotProps">
                    <font-awesome-icon :icon="['fas', slotProps.option.icon]" />
                </template>
            </SelectButton>
        </div>
        <ScrollPanel id="tag-scroller">
            <Tag v-for="tag in tags" :key="tag.id" class="tag" :severity="tag.showCount ? '' : 'secondary'"
                :class="{ active: tag.filterActive }" @click='clickedTag(tag)'>
                {{ tag.name }}
                <Badge :value="tag.showCount" :severity="tag.showCount ? 'success' : 'secondary'" class="count" />
            </Tag>
        </ScrollPanel>
    </div>
</template>

<script setup>

import { sort, sortOptions, tags, clickedTag } from '~/composables/useTags'

</script>

<style lang="scss" scoped>
#tags-container {
    background-color: $w2p-pallette-4;
    border-radius: 0.5rem;
    padding: 0.5rem;
}

#header {
    display: flex;
    flex-direction: row;
    justify-content: end;
    min-height: 2rem;
    margin-bottom: 0.5rem;
}

#active-tags {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}

#sort-btns {
    flex-shrink: 1;
    display: flex;
    align-items: center;
}

.tag {
    margin: 0.15rem;
    cursor: pointer;
}

.selected-tag {
    margin-left: 0.5rem;
}

.active-icon {
    margin-left: 2px;
    font-size: 0.75rem;
}

#tag-scroller {
    height: 300px;
    width: 100%;
}

.grayed {
    background-color: #aaaaaa;
}

.count {
    margin-left: 3px;
}

.active {
    background-color: #0058f0;
    color: white;
}
</style>