<template>
  <div>
    Home
    <pre>
      {{  session }}
    </pre>
  </div>
</template>

<script setup>
  const res = await $fetch('/api/hello')
  console.log("home")
  const session = useAuth()

  const logOut =  () => {
    console.log('loggin out')
    session.signOut({callbackUrl: '/'})
  }
</script>
