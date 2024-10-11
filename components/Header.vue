<template>
    <header class="flex items-center justify-between h-16 bg-surface-200">
        <a href="/">
            <img class="h-12 mx-2 rounded-md" src="~/assets/logo.svg" alt="logo" />
        </a>
        bgsift.net
        <div v-if="isAuthenticated">
            <img v-if="profileImageURL" @click="toggle" class="w-10 rounded-full mx-4 hover:ring-4" :src="profileImageURL" />
            <Menu ref="menu" :model="items" :popup="true" />
        </div>
        <Button v-else class="mx-2" @click="navigateTo('/login')">
            Sign up or Log In
        </Button>
    </header>
</template>

<script setup>

const { status, getSession, signOut } = useAuth()
const session = await getSession()

const isAuthenticated = computed(() => {
    return status.value == "authenticated"
})

const profileImageURL = computed(() => {
    return session?.user?.image
})

const menu = ref();
const items = ref([
    {
        items: [
            {
                label: 'My Games',
                icon: 'pi pi-database',
                command: () => {
                    navigateTo('/user/' + session.user.slug)
                }
            },
            {
                label: 'Settings',
                icon: 'pi pi-cog',
                url: '/settings'
            },
            {
                label: 'About',
                icon: 'pi pi-question-circle',
                url: '/about'
            },
            {
                label: 'Sign Out',
                icon: 'pi pi-sign-out',
                command: () => {
                    signOut({ callbackUrl: '/' })
                }
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

</script>

<style scoped>
</style>