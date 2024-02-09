<template>
    <div class="whose-games-container">
        <div v-if="!userData.isSelf">
            <img :src="userData.user.image" class="profile-image" alt="avatar">
            <h1>{{ userData.user.name }}'s Games</h1>
        </div>
        <h1 v-else>Your Games</h1>
    </div>
</template>

<script setup>
    const props = defineProps(['userData'])
</script>

<style scoped>
    .whose-games-container {
        display: flex;
        background-color: hsl(0,0,100);
    }
</style>