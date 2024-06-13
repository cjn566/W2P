<template>
       <Button id="btn" :class="sort == sorting.active? 'active' : ''" @click="sortBy(sort)" :label="label" 
       :icon="sort == sorting.active? (sorting.descending? 'pi pi-chevron-down':'pi pi-chevron-up') : 'pi pi-circle'" />
</template>


<script setup>
import { sortBy, sorting } from '~/composables/useGames'
const props = defineProps(['sort', 'label'])


</script>

<style lang="scss" scoped>

.active {
    background-color: #0058f0;
    color: white;
}

#btn {
    margin: 0;
    flex-grow: 1;
    border-radius: 0;
    border: 1px solid #c1ccdf;
}

</style>