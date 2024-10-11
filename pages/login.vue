<template>
  <div class="flex h-[100vh] justify-center bg-zinc-900 splash">
    <div class="flex flex-col items-center justify-between h-full w-[600px] bg-surface-800 px-12">
      <div class="flex flex-col items-center mt-12">
        <span class="text-5xl mb-4">Welcome</span>
        <div>
          This website allows you to quickly and easily share your collections of board games with your friends, allowing them to
          easily
          explore, sort, and filter your games. This makes it fun and effortless for your friends to find the perfect
          game
          to play, without any signup or app installation.
        </div>
      </div>
      <div class="flex flex-col items-center rounded-3xl p-8 bg-surface-900 my-12">
        <div class="text-4xl">
          Log in or Sign up
        </div>
        <div class="text-xs mb-2">
          using one of the following identity providers:
        </div>
        <a class="btn__login hover:ring-4 bg-google" @click="signIn('google')" role="button">
          <img class="logo-name google" alt="google name" src="~/assets/third-party/name-google.png" />
        </a>
        <a class="btn__login hover:ring-4 bg-github" @click="signIn('github')" role="button">
          <img class="logo-name github" alt="github name" src="~/assets/third-party/name-github2.png" />
        </a>
        <a class="btn__login hover:ring-4 bg-facebook" @click="signIn('facebook')" role="button">
          <img class="logo-name facebook" alt="facebook name" src="~/assets/third-party/name-facebook2.png" />
        </a>

        <span class="info-hoverer relative inline-block mt-4">
          <i class="pi pi-info-circle text-2xl" />
          <div class="info">
            <div class="border-b text-lg mb-2">
              We do not support On-Site Credentials
            </div>
            <div class="mb-2">
              For your convenience and security, our website does not support the creation of traditional usernames and
              passwords. Instead, we only allow sign-ups and logins through trusted third-party identity providers. This
              ensures that your personal information and credentials are securely
              managed
              by industry-leading authentication services.
            </div>
            <div class="mb-2">
              Thank you for your understanding and continued support.
            </div>
          </div>
        </span>
      </div>
      <div class="text-sm mb-12">
        The information about the board games in this site is powered by the third-party website <a
          href="boardgamegeek.com" class="underline">boardgamegeek.com</a>. This allows us to
        provide detailed and accurate data on each game, such as the supported number of players, the game length,
        and more.
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'layoutNoHeader',
})
const { signIn, status, getSession } = useAuth()
if (status.value === 'authenticated') {
  const session = await getSession()
  // alert('You are already logged in as ' + session.user.name)
  navigateTo('/user/' + session.user.slug)
}
</script>

<style lang="scss" scoped>
$color-github-1: #2c2f36;
$color-facebook-1: #33589e;

.btn__login {
  font-size: x-large;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: .5rem;
  padding: 1rem;
  width: 12rem;
  height: 4rem;
}

.logo-img {
  height: 3rem;
}

.logo-name {}

.google {
  height: 2.9rem;
  width: auto;
}

.github {
  top: 1.3rem;
  height: 2.4rem;
  width: auto;
}

.facebook {
  height: 1.9rem;
  width: auto;
}

.bg-google {
  background-color: #ffffff;
}

.bg-github {
  background-color: $color-github-1;
}

.bg-facebook {
  background-color: $color-facebook-1;
}

.info {
  display: none;
  /* Hidden by default */
  position: absolute;
  top: 100%;
  /* Position the popup above the icon */
  left: 50%;
  width: 80vw;
  max-width: 800px;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  z-index: 1;
  /* Ensure the popup appears on top */
}

.icon-container:hover .popup {
  display: block;
  /* Show the popup on hover */
}

.info-hoverer:hover .info {
  display: block;
  /* Show the popup on hover */
}

.splash {
  background-image: url('~/assets/cover-art-collage.jpg');
  background-size: cover;
  background-position: center;
}

</style>