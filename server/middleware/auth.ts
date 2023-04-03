import { getServerSession } from '#auth'
export default defineEventHandler(async (event) => {
    return
    console.log(event.node.req)
    console.log('\n Entering Auth Middleware with URL request: ' + event.node.req.url)
    if(event.node.req.url != '/') {
        console.log('Auth Required...')
        const session = await getServerSession(event)
        if (!session) {
            throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
        }
    }
    console.log('Exiting Auth Middleware\n')
})