<template>
  <div>
    index
    <NuxtLink to="home">Home page</NuxtLink>
  </div>
</template>

<script setup>
  
  definePageMeta({ auth: false })
  console.log("index")
</script>
