
import { StatusCodes } from 'http-status-codes';
import query from '../../db'
export default defineEventHandler(async (event) => {
    let ret = {}
    const q_result_user = (await query('SELECT name, email, sett_private, image, default_collection_id FROM app.users WHERE name_slug = $1', [event.context.params.user]))
    if (q_result_user.rowCount == 0) {
        // Could not find user
        log({ level: 'warn', source: '/user/[slug]', message: `User not found: ${event.context.params.user}` })
        throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: 'User not found. Please check the spelling of the URL.' })
    }
    const user = q_result_user.rows[0]
    try {
        ret = await checkUserViewerRelation(user, event)
    } catch ({ status, message }) {
        log({ level: 'warn', source: '/user/[slug]', message: `user-viewer relation blocked: ${status}`, context: { profile: user.email, message } })
        throw e
    }
    // If we made it here, they are allowed to see games
    // Get all collection IDs for this user
    let collections = (await query('SELECT id, collection_name FROM app.collections WHERE user_email = $1', [user.email])).rows
        .reduce((obj, collection) => {
            obj[collection.id] = collection
            return obj
        }, {})

    // Get all game IDs in each collection
    for (let c in collections) {
        collections[c].gameIDs = (await query('SELECT id, bgg_game_id FROM app.games WHERE collection_id = $1', [c])).rows
    }

    return {
        ...ret,
        ...user,
        collections,
        slug: event.context.params.user
    }
})