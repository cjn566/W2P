import query from '../db'
export default defineAuthenticatedEventHandler(async (event, session) => {

    console.log("Hello API session: ", session)

    const res = (await query('SELECT * FROM app.games WHERE entry_id = $1', [2])).rows[0]
    return {
      game_user: res.user_id
    }
  })