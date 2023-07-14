import query from '../db'
import slugify from 'slugify'
import { getServerSession } from '#auth'
export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if(session){
        const q_result_user = (await query('SELECT name_slug FROM app.users WHERE email = $1', [session.user.email]))
        if(q_result_user.rowCount == 0) {
            // First time user. Generate name slug
            let name_attempt = slugify(session.user.name)
            let counter = 0
            do {
                let i_result_user = (await query('INSERT into app.users(email, created_by, name, name_slug) VALUES ($1, $2, $3, $4)'),
                [
                    session.user.email,
                    session.user.email,
                    session.user.name,
                    name_attempt + counter? '': counter
                ])
                counter++
            } while (true)
        } else {
            //Found 'em
            // TODO: redirect to /user/name_slug
        }
    }
})