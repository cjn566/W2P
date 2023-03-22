import { JwtRsaVerifier } from 'aws-jwt-verify'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  const verifier = JwtRsaVerifier.create({
    audience: config.public.auth0.audience,
    issuer: config.authApi.issuerBaseURL
  })

  // console.log('verifier', verifier)
  // console.log('event', event)

})