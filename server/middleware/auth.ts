import { getServerSession } from '#auth'
export default defineEventHandler(async (event) => {
    console.log(event)
    if(event.node.req.url != '/') {
        console.log('AUTH MIDDLEWARE')
        const session = await getServerSession(event)
        if (!session) {
            throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
        }
    }
})