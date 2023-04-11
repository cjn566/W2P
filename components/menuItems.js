
export default {
    profile: {
        name: 'cosme fulanito',
        img: '../assets/profile.svg',
        onClick() {
            console.log('Hola desde onClick() de profile');
        }
    },
    items: [{
            id: 0,
            title: 'My Collection',
            // <font-awesome-icon icon="fa-solid fa-house-user" />
            icon: 'dice',
            onClick() {
                navigateTo('/home')
            }
        },
        {
            id: 1,
            title: 'Freinds',
            // <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
            icon: 'users',
            onClick() {
                navigateTo('/friends')
            }
        },
        {
            id: 1,
            title: 'Events',
            // <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
            icon: 'calendar-days',
            onClick() {
                navigateTo('/events')
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