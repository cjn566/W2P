<template>
  <div v-if="contentUnavailable" class="unavailable">
    {{ contentUnavailable.message }}
  </div>
  <div v-else>
    <NuxtPage />
  </div>
</template>

<script setup>
import { user, setUser } from '~/composables/useGames'
import { useToast } from 'primevue/usetoast'
// import QrcodeVue from 'qrcode.vue'

// const value = ref('http://localhost:3000/user/colten-nye')
//   const level = ref('Q')
//   const renderAs = ref('svg')

const toast = useToast()

const route = useRoute()

const contentUnavailable = computed(() => {
  if (user?.err_code) {
    switch (userData.err_code) {
      case "no_user":
        return {
          message: "That user doesn't exist. Please check the spelling and try again"
        }
      case "not_friends":
        return {
          message: "That user is only sharing their info with friends. Try sending them a friend request."
        }
      case "private_not_self":
        return {
          message: "That user's info is not available at this time."
        }
      case "friends_only_logged_out":
        return {
          message: "That user is only sharing their info with friends. If you are their friend, please log in first."
        }
      case "private_logged_out":
        return {
          message: "That user's info is not available. If you are this user, please log in to see your content."
        }

      default:
        break;
    }

  }
  return false
})

await setUser(route.params.slug)

</script>

<style lang="scss" scoped>
.unavailable {
  margin: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: rgb(216, 215, 214);
}

</style>