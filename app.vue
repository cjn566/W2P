<template>
  <div id="app" class="">
    <Toast />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>


<script setup>
useHead({
  bodyAttrs: {
  },
  htmlAttrs: {
    // class: 'p-dark',
  },
})

</script>


<style lang="scss" scoped>
</style>