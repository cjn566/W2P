import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  // TODO: Auth check
  const { cId } = readBody(event)
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