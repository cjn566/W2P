<template>
    <div>
        <span>
            <TopMenu />
            <div class="content">
                <slot />
            </div>
        </span>
    </div>
</template>

<script setup>
</script>

<style>
    .content {
        padding-left: 8rem;
    }
</style>
