import query from '../../db'
import { getServerSession } from '#auth'
export default defineEventHandler(async (event) => {    


    const q_result_user = (await query('SELECT name, email, sett_private, image FROM app.users WHERE name_slug = $1', [event.context.params.user]))
    if(q_result_user.rowCount == 0) {
        // Could not find user
        return { err_code: 'no_user' }
    } 
    const user = q_result_user.rows[0]
    const session = await getServerSession(event)
    let isSelf = false
    let friend_status = 'none'
    if(session){
        if(session.user.email == user.email) {
            // Is self
            isSelf = true
            friend_status = "self"
        } else {
            // Is logged in looking at other profile
            // Show if public or if friends
            
            // Check if friends
            const friends_q = [session.user.email, user.email].sort()
            const q_result_friends = (await query('SELECT status FROM app.friends where user_1 = $1 and user_2 = $2', friends_q))
            if(q_result_friends.rowCount == 1) {
                friend_status =  q_result_friends.rows[0].status
            }

            switch (user.set_private) {
                case 'set_priv_friends': 
                    if(friend_status != 'fr_accept')
                        return { err_code: 'not_friends' }
                    break
                case 'set_priv_private': return { err_code: 'private_not_self' }
                default: break
            }
        }
    } else {
        // Is not logged in, only show profile if public
        switch (user.set_private) {
            case 'set_priv_friends': return { err_code: 'friends_only_logged_out' }
            case 'set_priv_private': return { err_code: 'private_logged_out' }
            default: break
        }
    }

    // If we made it here, they are allowed to see games
    const games = (await query('SELECT id, bgg_game_id FROM app.games WHERE user_email = $1', [user.email])).rows

    return {
        ...user,
        games,
        isSelf,
        friend_status,
        slug: event.context.params.user
    }

  })