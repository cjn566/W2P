<template>
    <header class="header">
        <div v-if="isAuthenticated">
            <ul class="menu">
                <a href="#" @click.prevent="navigateTo('/user/' + session.user.slug)">
                    <div class="item">
                        <div class="item__icon">
                            <font-awesome-icon :icon="['fas', 'dice']" size="2x" />
                        </div>
                    </div>
                </a>
                <MenuItem v-for="item in headerContent.navPages" :key="item.id" :item="item" />

                <div class="header__profile dropdown">
                    <a role="button" data-bs-toggle="dropdown" href="#">
                        <div class="profile-image" :style="`background-image:url(${profileImageURL})`" />
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <MenuItem class="dropdown-item" v-for="item in headerContent.menuItems" :key="item.id"
                            :item="item" />
                    </ul>
                </div>
            </ul>
        </div>
        <div v-else>
            <NuxtLink to="/events">Log In</NuxtLink>
        </div>
    </header>
</template>

<script setup>

import headerContent from './headerContent'

const { status, getSession } = useAuth()
const session = await getSession()

const isAuthenticated = computed(() => {
    return status.value == "authenticated"
})

const profileImageURL = computed(() => {
    return session?.user?.image
})

</script>



<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: rgb(228, 228, 228);
    width: 100%;
}

.header__profile {
    justify-self: end;
}

.profile-image {
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}

.menu {
    display: flex;
}

.navBar {
    position: relative;
    height: var(--nav-height);

}

.container.content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
}

.menu-button {
    width: 4.4rem;
    height: 4.4rem;
    border: none;
    background-color: transparent;
    margin: 0 auto;
    display: block;
}

.profile {
    display: flex;
    padding: var(--separacion);
    gap: var(--separacion);
    align-items: center;
}

.profile__img {
    width: 4.4rem;
}

.profile__name {
    text-align: center;
}

.profile__name a {
    text-decoration: none;
    text-transform: capitalize;
}


.menu__item ul {
    padding: 0;
    list-style: none;
    margin: 0;
}
</style>