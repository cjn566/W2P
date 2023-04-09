<template>
    <div>
        <span>
            <Menu />
            <slot />
        </span>
    </div>
</template>

<script setup>
    const { signOut } = useAuth()
</script>