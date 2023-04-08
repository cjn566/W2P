import { getServerSession } from '#auth'

export function defineAuthenticatedEventHandler( handler ) {
    return defineEventHandler(async (event) => {
      const session = await getServerSession(event)
      if(!session){
        console.log('authHandler Unauthorized: ', event.node.req.url)
        return sendRedirect(event, '/')
      }
      console.log('authHandler Authorized')
      return handler(event, session)
    })
  }