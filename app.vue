<template>
  <div id="app">
    <Toast />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped>
#app {
  width: 100%;
  margin: 0 auto;

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