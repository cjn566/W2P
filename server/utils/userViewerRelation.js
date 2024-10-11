import query from '../db'
import { getServerSession } from '#auth'

export async function checkUserViewerRelation(user, event) {
  
    
    const session = await getServerSession(event)
    let isSelf = false
    let friend_status = 'none'
    let err_code = null
    if (session) {
        if (session.user.email == user.email) {
            // Is self
            isSelf = true
            friend_status = "self"
        } else {
            // Is logged in looking at other profile
            // Show if public or if friends

            // Check if friends
            // Since friend relations are always saved alphabetically, we must sort the two emails first
            const friends_q = [session.user.email, user.email].sort()
            const q_result_friends = (await query('SELECT status FROM app.friends where user_1 = $1 and user_2 = $2', friends_q))
            if (q_result_friends.rowCount == 1) {
                friend_status = q_result_friends.rows[0].status
            }

            switch (user.set_private) {
                case 'set_priv_friends':
                    if (friend_status != 'fr_accept')
                        err_code = 'not_friends'
                    break
                case 'set_priv_private': err_code = 'private_not_self'
                default: break
            }
        }
    } else {
        // Is not logged in, only show profile if public
        switch (user.set_private) {
            case 'set_priv_friends': 
                err_code = 'friends_only_logged_out'
                break
            case 'set_priv_private': err_code = 'private_logged_out'
            default: break
        }
    }
    return { isSelf, friend_status, err_code }
}