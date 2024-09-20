<template>
  <div id="app" class="dark">
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
#app {
  width: 100%;
  margin: 0 auto;

  background-color: var();

  @media only screen and (min-width: $tablet-breakpoint) {
    max-width: $tablet-breakpoint;
  }

  @media only screen and (min-width: $desktop-breakpoint) {
    max-width: $desktop-breakpoint;
  }

  @media only screen and (min-width: $large-screen-breakpoint) {
    max-width: $large-screen-breakpoint;
  }
}
</style>