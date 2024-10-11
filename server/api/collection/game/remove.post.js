import query from '../../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {

  const body = await readBody(event)
  const ress = await Promise.all(body.map(async (userGameId) => {
    try {
      const qRes = await query('DELETE FROM app.games WHERE id = $1', [userGameId])
      return {
        err: false,
        userGameId
      }
    } catch (e) {
      const res = {
        err: true,
        msg: "?"
      }
      return res
    }
  }))
  return ress
})