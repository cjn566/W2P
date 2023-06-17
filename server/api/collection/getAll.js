import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
    const res = (await query('SELECT id, bgg_game_id FROM app.games WHERE user_email = $1', [session.user.email])).rows
    return res
  })