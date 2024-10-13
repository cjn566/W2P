import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const { cId } = getQuery(event)
  try {
    await query('DELETE FROM app.collections WHERE id = $1', [cId])
    return {
      err: false
    }
  } catch (e) {
    return {
      err: true,
      msg: "?"
    }
  }
})