import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const body = await readBody(event)
  const ress = await Promise.all(body.map(async (bgg_game_id) => {
    try {
      const qRes = await query('INSERT INTO app.games(user_email, bgg_game_id, created_by) VALUES ($1, $2, $3) returning id',
        [
          session.user.email,
          bgg_game_id,
          session.user.email
        ])
      return {
        err: false,
        newID: qRes.rows[0].id,
        bgg_game_id
      }
    } catch (e) {
      const res = {
        err: true,
        msg: "?"
      }
      if (e.code == 23505) {
        console.error("Duplicate game, unable to add.")
        res.msg = "duplicate"
      }
      return res
    }
  }))
  return ress
})