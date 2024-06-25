<template>
    <Button class="btn" :class="sort == sorting.active ? 'active' : ''" @click="doClick" :label="label"
        :icon="sort == sorting.active ? (sorting.descending ? 'pi pi-chevron-down' : 'pi pi-chevron-up') : 'pi pi-circle'">
        <template #default>
            <i :class="sort == sorting.active ? (sorting.descending ? 'pi pi-chevron-down' : 'pi pi-chevron-up') : 'pi pi-circle'" />
            <font-awesome-icon v-if="isDesktop" class="label" :icon="['fas', icon]" size="2x"/>
            <span v-else class="label">{{ label }}</span>
        </template>
    </Button>
</template>


<script setup>
import { sortBy, sorting } from '~/composables/useGames'
import { isDesktop } from '~/composables/useMedia'
const props = defineProps(['sort', 'label', 'icon'])
const emit = defineEmits(['scroll'])

const doClick = () => {
    sortBy(props.sort)
    emit('scroll')
}

</script>

<style lang="scss" scoped>
.active {
    background-color: #0058f0;
    color: white;
}

.btn {
    margin: 0;
    flex-grow: 1;
    border-radius: 0;
    border: 1px solid #c1ccdf;
    padding: 0.5rem;
    :first {
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
    
    }
}



.label {
    margin-left: 0.5rem;
}
</style>