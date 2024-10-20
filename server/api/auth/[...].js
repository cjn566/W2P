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
        let slug = ""
        const q_result_user = (await query('SELECT name_slug FROM app.users WHERE email = $1', [user.email]))
        if (q_result_user.rowCount == 0) {
          // Not in the DB, so make a new user          
          // attempt name slugs based on their token provided name until succeeds as unique

          let counter = 1
          let tryAgain = false
          let slugAttempt = ""
          do {
            try {
              slugAttempt = slugify(user.name + (counter > 1 ? (' ' + counter) : ''), { lower: true })
              let i_result_user = (await query('INSERT into app.users(email, created_by, name, image, name_slug) VALUES ($1, $2, $3, $4, $5)',
                [
                  user.email,
                  user.email,
                  user.name,
                  user.image ? user.image : '',
                  slugAttempt
                ]))
              tryAgain = false
            } catch (error) {
              if (error.constraint == 'users_name_slug_key') {
                counter++
                tryAgain = true
              } else {
                throw error
              }
            }
          } while (tryAgain)

            
          // Then give them a default collection
          let DCI = (await query('INSERT into app.collections(user_email, collection_name, created_by) VALUES ($1, $2, $3) returning id',
            [
              user.email,
              'Owned Games',
              user.email
            ])).rows[0].id

          // Then update the user to this default collection
          await query('UPDATE app.users SET default_collection_id = $1 WHERE email = $2',[ DCI, user.email ])

          slug = slugAttempt
          token.isNew = true

          // TODO: when this fails it redirects to nuxtauth generic error page, need to fix
        }
        else {
          slug = q_result_user.rows[0].name_slug
        }
        token.slug = slug
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token.slug) {
        session.user.slug = token.slug
      } else {
        session.user.slug = (await query('SELECT name_slug FROM app.users WHERE email = $1', [session.user.email])).rows[0]?.name_slug || ""
      }
      session.user.isNew = token.isNew
      return Promise.resolve(session)
    }

  }
})

