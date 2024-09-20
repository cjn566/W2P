<template>
    <div class="flex h-16 items-center text-lg mt-4 mx-4">
        <Button class="btn" :class="{ active: isDesc }" @click="doClick(true)">
            <i class="pi pi-chevron-down" />
            <div class="text-xs">{{ sort.descLabel }}</div>
        </Button>
        <div class="grow">
            <font-awesome-icon class="mx-4" :icon="['fas', sort.icon]" />
            <span class="mr-4">
                {{ sort.name }}
            </span>
        </div>
        <Button class="btn" :class="{ active: isAsc }" @click="doClick(false)">
            <i class="pi pi-chevron-up" />
            <div class="text-xs">{{ sort.ascLabel }}</div>
        </Button>
    </div>
</template>


<script setup>
import { sortBy, sorting } from '~/composables/useGames'
const props = defineProps(['sort'])
const emit = defineEmits(['clicked'])

const isDesc = computed(() => {
    return (sorting.value.active == props.sort.value && sorting.value.descending)
})

const isAsc = computed(() => {
    return (sorting.value.active == props.sort.value && !sorting.value.descending)
})

const doClick = (desc) => {
    sortBy(props.sort.value, desc)
    emit('clicked')
}

</script>

<style lang="scss" scoped>
.btn {
    display: flex;
    flex-direction: column;
    width: 4rem;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: green;
    color: whitesmoke;
    border-radius: 4px;
}

.active {
    background-color: #0058f0;
    color: white;
}
</style>