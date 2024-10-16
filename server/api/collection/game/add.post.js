import query from '../../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const { gameIDs, cId } = await readBody(event)

  if (session.user.email !== (await query('SELECT user_email FROM app.collections WHERE id = $1', [cId])).rows[0].user_email) {
    return {
      err: true,
      msg: "Unauthorized"
    }
  }
  return (await Promise.all(gameIDs.map((gId) => {
    try {
      return query(
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
        return { err: true, msg: "duplicate" }
      }
    }
  }

  ))).map(qRes => {
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