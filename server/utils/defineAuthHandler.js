import { getServerSession } from '#auth'

export function defineAuthenticatedEventHandler( handler ) {
    return defineEventHandler(async (event) => {
      // console.log('authHandler for route: ', event.node.req.url)
      const session = await getServerSession(event)
      if(!session){
        console.log('UNAUTHORIZED!')
        return sendRedirect(event, '/')
      }
      // console.log('Authorized')
      return handler(event, session)
    })
  }