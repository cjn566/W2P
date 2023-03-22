<template>
  <div>
    <div>
      <button @click="login">Log In</button>
      <button @click="logout">Log Out</button>
      <pre>
        <code>{{ status }}</code>
        <code>{{ data }}</code>
      </pre>
    </div>
    
    <button @click="testapi">Test API</button>
  </div>
</template>

<script setup>
  const { status, data, signIn, signOut } = useSession()
  status.value // Session status: `unauthenticated`, `loading`, `authenticated`
  data.value // Session data, e.g., expiration, user.email, ...

  async function login () {
    await signIn()
  }

  async function logout() {
    await signOut()
  }
  
  async function testapi() {
    const token = await auth0.getAccessTokenSilently()
    console.log(token)
    const testResults = await useFetch('/api/hello', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    console.log(testResults)
  }
</script>