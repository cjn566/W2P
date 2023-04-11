<template>
  <div>
    Home
    <pre>
      {{  session }}
    </pre>
  </div>
</template>

<script setup>
  const session = useAuth()
</script>
