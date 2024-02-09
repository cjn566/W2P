
export default {
    menuItems: [
        {
            id: 0,
            title: 'My Games',
            // <font-awesome-icon icon="fa-solid fa-fire" />
            icon: 'dice',
            onClick() {
                navigateTo('/user/' + session.user.slug)
            }
        },
        {
            id: 1,
            title: 'Settings',
            // <font-awesome-icon icon="fa-solid fa-fire" />
            icon: 'gear',
            onClick() {
                navigateTo('/settings')
            }
        },
        {
            id: 2,
            title: 'About',
            // <font-awesome-icon icon="fa-solid fa-fire" />
            icon: 'circle-question',
            onClick() {
                navigateTo('/about')
            }
        },
        {
            id: 3,
            title: 'Sign Out',
            // <font-awesome-icon icon="fa-solid fa-info" />
            icon: 'right-from-bracket',
            onClick() {
                const { signOut } = useAuth()
                signOut({callbackUrl: '/'})
            }
        }
    ]
}