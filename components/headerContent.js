
export default {
    navPages: [
        {
            id: 0,
            title: 'My Collection',
            icon: 'dice',
            onClick() {
                navigateTo('/home')
            }
        },
        {
            id: 1,
            title: 'Freinds',
            icon: 'users',
            onClick() {
                navigateTo('/friends')
            }
        },
        {
            id: 2,
            title: 'Events',
            icon: 'calendar-days',
            onClick() {
                navigateTo('/events')
            }
        }
    ],
    menuItems: [
        {
            id: 0,
            title: 'Settings',
            // <font-awesome-icon icon="fa-solid fa-fire" />
            icon: 'gear',
            onClick() {
                navigateTo('/settings')
            }
        },
        {
            id: 1,
            title: 'About',
            // <font-awesome-icon icon="fa-solid fa-fire" />
            icon: 'circle-question',
            onClick() {
                navigateTo('/about')
            }
        },
        {
            id: 2,
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