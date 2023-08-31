<template>
    <div class="bio">
        <img v-if="user.image" :src="user.image" alt="">
        <p>Showing profile for {{ user.name }}</p>
    </div>
</template>

<script setup>
    const props = defineProps(['user'])
</script>

<style scoped>
    .bio {
        background-color: aqua;
    }
</style>