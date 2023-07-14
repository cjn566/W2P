<template>
    <div>
        <Header />
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup>
    
</script>

<style>
.content {
    padding-top: calc(var(--nav-height) + 1rem);
}
</style>
