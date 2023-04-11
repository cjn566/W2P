<template>
  <div>
    Home
    <pre>
      {{  session }}
      
      {{  session }}
      {{  session }}
      {{  session }}
      {{  session }}
    </pre>
  </div>
</template>

<script setup>
  const session = useAuth()
</script>
