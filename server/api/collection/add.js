import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
    const params = getQuery(event)
    try {
      const res = (await query('INSERT INTO app.games(user_email, bgg_game_id, created_by) VALUES ($1, $2, $3)',
      [
        session.user.email,
        params.bgg_game_id,
        session.user.email
      ])).rows[0]  
    } catch (e) {
      if(e.code == 23505){
        console.error("Duplicate game, unable to add.")
        return "duplicate"
      }
    }
    
  })