<template>
    <header>
        <div v-if="isAuthenticated">

            <div class="header__profile dropdown">

               
                <a role="button" href="#" @click="toggle">
                    <img class="profile__img" :src="profileImageURL" />
                </a>
                <Menu ref="menu" :model="items" :popup="true" />

            </div>
        </div>
        <Button v-if="showLoginButton" class="btn-login">
            <NuxtLink to="/login">Sign up or Log In</NuxtLink>
        </Button>
    </header>
</template>

<script setup>
import Menu from 'primevue/menu';

const { status, getSession, signOut } = useAuth()
const session = await getSession()
const route = useRoute()


const isAuthenticated = computed(() => {
    return status.value == "authenticated"
})

const showLoginButton = computed(() => {
    return !isAuthenticated.value && ( route.path !== '/login' )
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
                command: ()=>{
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
                command: ()=>{
                    signOut({callbackUrl: '/'})
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
    background-color: $w2p-pallette-1;
    color: $w2p-pallette-4;
}

header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 4rem;
}

.header__profile {
}

.profile__img {
    width: 3.5rem;
    margin: 10px;
    border-radius: 50%;
}

</style>