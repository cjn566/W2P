<template>
    <SelectButton class="float-right" v-model="tagSort" :options="sortOptions" optionLabel="label"
        :pt="{ root: 'btn-sort' }">
        <template #option="slotProps">
            <font-awesome-icon :icon="['fas', slotProps.option.icon]" />
        </template>
    </SelectButton>
    <div v-for="tag in tagList" :key="tag.id"
        class="inline-block cursor-pointer hover:ring-1 m-1 rounded-full pl-2 text-sm whitespace-nowrap text-slate-900  bg-surface-200"
        :class="{ 
            '!bg-surface-700 !text-white ': tag.filterActive,
            '!bg-slate-300' : !tag.showCount
         }" @click='clickedTag(tag)'>
        {{ tag.name }}
        <Badge :value="tag.showCount" class="m-1 text-white" :severity="tag.showCount? 'primary': 'info'"/>
    </div>
</template>

<script setup>

import { sortTags, clickedTag } from '~/composables/useGames'

const props = defineProps(['tagList'])

const sortOptions = ref([
    { label: 'Alphabetical', sortByName: true, icon: 'arrow-down-a-z' },
    { label: 'Count', sortByName: false, icon: 'hashtag' }
])

//tag.showCount

const tagSort = ref(sortOptions.value[0])

watch(tagSort, (newSort) => {
    sortTags(newSort.sortByName)
})

</script>

<style lang="scss" scoped></style>