<template>
    <div>
        <span>
            <Menu />
            <div class="content">
                <slot />
            </div>
        </span>
    </div>
</template>

<script setup>
    const { signOut } = useAuth()
</script>

<style>
    .content {
        padding-left: 8rem;
    }
</style>
