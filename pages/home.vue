<template>
  <div>
    Home
  </div>
</template>

<script setup>
  const auth = useAuth()

  const session = await auth.getSession()
  console.log(session)
</script>
