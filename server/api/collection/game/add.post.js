import { checkIfOwnerOfCollection } from '~/server/utils/checkIfOwnerOfCollection'
import query from '../../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const { gameIDs, cId } = await readBody(event)

  checkIfOwnerOfCollection(session.user.email, cId)

  return (await Promise.all(gameIDs.map(async (gId) => {4
    try {
      return await query(
        `INSERT INTO app.games(collection_id, bgg_game_id, created_by)
          VALUES ($1, $2, $3)
          RETURNING id, bgg_game_id`,
        [
          cId,
          gId,
          session.user.email
        ])
    } catch (e) {
      if (e.code === '23505') {
        return { err: "duplicate", bgg_game_id: gId }
      } else {
        return { err: "unknown", bgg_game_id: gId, message: e.message }
      }
    }
  }))).map(qRes => {
    if (qRes.err) {
      return qRes
    } else {
      return {
        id: qRes.rows[0].id,
        bgg_game_id: qRes.rows[0].bgg_game_id
      }
    }
  })
})