<template>
    <header class="header">
        <ul class="menu">
            <MenuItem v-for="item in headerContent.navPages" :key="item.id" :item="item" />
        </ul>        
        
        <a href="#">
            <div class="item">
                <img :src="session.user.image" alt="profile image">
            </div>
        </a>

    </header>
</template>

<script setup>
/*
                        <div class="profile">
                            <img class="profile__img" :src="session.user.image" :alt=menuItems.profile.img>
                            <div class="profile__name"> <a href="#" @click.prevent="menuItems.profile.onClick"> {{ session.user.name }} </a> </div>
                        </div>

                        
            <MenuItem v-for="item in headerContent.menuItems" :key="item.id" :item="item" />

*/

import headerContent from './headerContent'

const { getSession } = useAuth()
const session = await getSession()
console.log(session)


</script>

<style scoped>
.header {
    display: flex;
    background-color: var(--colorNegro);
    width: 100%;
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

.menu__item {}

.menu__item ul {
    padding: 0;
    list-style: none;
    margin: 0;
}
</style>