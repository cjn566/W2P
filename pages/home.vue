<template>
  <div>
    Home
    <pre>
      {{ session }}
    </pre>
  </div>
</template>

<script setup>
  // const res = await $fetch('/api/hello')
  console.log("index")
  const session = useSession()
</script>
