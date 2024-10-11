import query from '../../db'
import { getGameInfo } from '../../utils/boardgamegeek'
export default defineEventHandler(async (event) => {
    let ret = {}
    const q_result_user = (await query('SELECT name, email, sett_private, image FROM app.users WHERE name_slug = $1', [event.context.params.user]))
    if (q_result_user.rowCount == 0) {
        // Could not find user
        ret.err_code = 'no_user'
        // TODO: redirect to 404
    } else {
        const user = q_result_user.rows[0]
        ret = await checkUserViewerRelation(user, event)
        if (!ret.err_code) {
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

            // If a collection ID param was sent and is valid and matches one of the users collections, use that, otherwise use the first collection
            let cId = parseInt(getQuery(event)?.cId)
            if (collections[cId] === undefined) {
                cId = Object.keys(collections)[0]
            }

            // Get all game info for the games in the collection
            let games = await getGameInfo(collections[cId].gameIDs.map(x => x.bgg_game_id))
            
            collections[cId].gameIDs.forEach((g) => {
                games[g.bgg_game_id].userGameId = g.id
            })

            ret = {
                ...ret,
                ...user,
                collections,
                cId,
                games,
                slug: event.context.params.user
            }
        }
    }

    return ret
})