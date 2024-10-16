import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const { cId } = readBody(event)
  try {
    await query(`UPDATE app.users
      SET default_collection_id = $1, modified_by = $2
      WHERE email = $3`, [cId, session.user.email, session.user.email])
    return {
      err: false
    }
  } catch (e) {
    return {
      err: true,
      msg: e
    }
  }
})