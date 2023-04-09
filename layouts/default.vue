<template>
    <div>
        <button @click="signOut({callbackUrl: '/'})">Log Out</button>
        <slot />
    </div>
</template>

<script setup>
    const { signOut } = useAuth()
</script>