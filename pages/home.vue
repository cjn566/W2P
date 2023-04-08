<template>
  <div>
    <button @click="logOut">Sign Out</button>
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

  const logOut =  () => {
    console.log('loggin out')
    session.signOut()
  }
</script>
