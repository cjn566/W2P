<template>
  <div>
    Hi. Welcome to my app.
    <NuxtLink to="/api/auth/signin">Sign Up or Log In</NuxtLink>
  </div>
</template>

<script setup>

  definePageMeta({ 
    // auth: {
    //   unauthenticatedOnly: true,
    //   navigateAuthenticatedTo: '/home',
    // },
  })
</script>
