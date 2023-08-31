import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
    const params = getQuery(event)
    try {
      const res = (await query('INSERT INTO app.games(user_email, bgg_game_id, created_by) VALUES ($1, $2, $3) returning id',
      [
        session.user.email,
        params.id,
        session.user.email
      ]))
      return {
        err: false,
        newID: res.rows[0].id
      }
    } catch (e) {
      if(e.code == 23505){
        console.error("Duplicate game, unable to add.")
        return {
          err: true,
          msg: "duplicate"
        }
      }
    }
    
  })