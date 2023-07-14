<template>
  <div>
    Hi. Welcome to my app.
    <NuxtLink to="/events">Sign Up or Log In</NuxtLink>
  </div>
</template>

<script setup>

  definePageMeta({ 
    // auth: {
    //   unauthenticatedOnly: true,
    //   navigateAuthenticatedTo: '/home',
    // },
    layout: false
  })
</script>
