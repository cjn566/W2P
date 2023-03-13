<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup>
  const res = await $fetch('/api/hello')
  console.log(res)
</script>
