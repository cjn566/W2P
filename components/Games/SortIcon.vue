<template>
    <div>
        <i v-show="props.order > 0" class="pi pi-angle-up"></i>
        <i v-show="props.order < 0" class="pi pi-angle-down"></i>
    </div>
</template>

<script setup>
const props = defineProps(['order'])
</script>

<style scoped></style>