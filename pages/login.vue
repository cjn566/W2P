<template>
  <container>
    <h1>Log in or Sign up</h1>
    <a class="btn btn-outline-dark btn__login btn__google" @click="signIn('google')" role="button">
      <img class="logo-img" alt=""
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/IOS_Google_icon.png/120px-IOS_Google_icon.png?20150923131459" />
      
        <div class="btn-text">
        Google
      </div>
    </a>
    <a class="btn btn-outline-dark btn__login btn__github" @click="signIn('github')" role="button">
      <img class="logo-img" alt=""
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/120px-GitHub_Invertocat_Logo.svg.png?20230417032619" />
        
      <div class="btn-text">
        Github
      </div>
    </a>
    <a class="btn btn-outline-dark btn__login btn__facebook" @click="signIn('facebook')" role="button">
      <img class="logo-img" alt=""
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Facebook_icon_192.png/120px-Facebook_icon_192.png?20200225065925" />

      <div class="btn-text">
        Facebook
      </div>
    </a>
  </container>
</template>
  
<script setup>
definePageMeta({
  layout: 'layoutNoHeader',
})
const { signIn, status, getSession } = useAuth()
if(status.value === 'authenticated') {
  const session = await getSession()
  // alert('You are already logged in as ' + session.user.name)
  navigateTo('/user/' + session.user.slug)
}
</script>
  
<style lang="scss" scoped>
.logo-img {
  height: 90%;
}

.btn__login {
  width: 200px;
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: flex-start;
  margin: 6px;
  text-transform: none
}

.btn-text {
  font-size: x-large;
  flex: 1;
}

.btn__google {
  background-color: #FFFFFF;
}

.btn__github {
  background-color: #161B22;
  color: white;
}

.btn__facebook {
  background-color: #F0F2F5;
}

container {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-flow: column;
}</style>