<template>
    <header>
        <a href="/">
            <img id="logo" src="~/assets/logo.svg" alt="logo" />
        </a>
        whattoplay.net
        <div v-if="isAuthenticated">
            <img @click="toggle" class="profile__img" :src="profileImageURL" />
            <Menu ref="menu" :model="items" :popup="true" />
        </div>
        <Button v-else class="btn-login" @click="navigateTo('/login')">
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



<style lang="scss" scoped>
.btn-login {
    margin: 10px;
    border-radius: 5px;
}

header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 4rem;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

.right-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
}

#logo {
    height: 3rem;
    margin: 10px;
}

.profile__img {
    width: 3.5rem;
    margin: 10px;
    border-radius: 50%;
}
</style>