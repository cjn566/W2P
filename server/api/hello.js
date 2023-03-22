import query from '../db'
export default defineEventHandler(async (event) => {

    console.log(event.node.req.rawHeaders)

    const res = (await query('SELECT * FROM app.games WHERE entry_id = $1', [2])).rows[0]
    return {
      game_user: res.user_id
    }
  })