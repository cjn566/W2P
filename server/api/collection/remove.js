import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
    const params = getQuery(event)
    console.log("deleting: ", params)
    try {
      await query('DELETE FROM app.games WHERE id = $1',[params.id])
      return {err: false}
    } catch (e) {
      return {
        err: true,
        msg: "Who knows."
      }
    }
    return true
  })