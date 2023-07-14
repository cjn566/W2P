// file: ~/server/api/auth/[...].ts
import GithubProvider from 'next-auth/providers/github'
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import { NuxtAuthHandler } from '#auth'
import query from '../../db'
import slugify from 'slugify'

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: process.env.AUTH_SECRET,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET
    }),
    FacebookProvider.default({
      clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET
    }),
    GithubProvider.default({
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) { // Token just initialized, check if they are already in the DB
        const q_result_user = (await query('SELECT name_slug FROM app.users WHERE email = $1', [user.email]))
        if (q_result_user.rowCount == 0) {
          // Not in the DB, attempt name slugs until succeeds as unique
          let counter = 1
          let tryAgain = false
          do {
            try {
              let i_result_user = (await query('INSERT into app.users(email, created_by, name, name_slug) VALUES ($1, $2, $3, $4)',
                [
                  user.email,
                  user.email,
                  user.name,
                  slugify(user.name + (counter > 1 ? (' ' + counter) : ''))
                ]))
                tryAgain = false
            } catch (error) {
              if(error.constraint == 'users_name_slug_key'){
                counter++
                tryAgain = true
              } else {
                throw
              }
            }
          } while (tryAgain)
        }
      }
      return token
    }
  }
})

