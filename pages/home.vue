<template>
  <div>
    Home
    <pre>
      {{ session }}
    </pre>
  </div>
</template>

<script setup>
  const res = await $fetch('/api/hello')
  console.log("home")
  const session = useSession()
  console.log("home page session: ", session)
</script>
