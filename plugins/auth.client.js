import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth0 = createAuth0({
    domain: config.public.auth0.domain,
    clientId: config.public.auth0.clientId,
    authorizationParams: {
      redirect_uri: config.public.auth0.callbackUrl,
      audience: config.public.auth0.audience
    }
  })

  nuxtApp.vueApp.use(auth0)

  // addRouteMiddleware('auth', () => {
  //   if (process.client) {
  //     auth0.checkSession()
  //     if (!auth0.isAuthenticated.value) {
  //       auth0.loginWithRedirect({
  //         appState: {
  //           target: useRoute().path,
  //         },
  //       })
  //     }
  //   }
  // })
})