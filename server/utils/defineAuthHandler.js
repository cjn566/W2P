import { getServerSession } from '#auth'

export function defineAuthenticatedEventHandler( handler ) {
    return defineEventHandler(async (event) => {
      const session = await getServerSession(event)
      if(!session){
        console.log('authHandler Unauthorized')
        throw Error("Unauthorized")
      }
      console.log('authHandler Authorized')
      return handler(event, session)
    })
  }