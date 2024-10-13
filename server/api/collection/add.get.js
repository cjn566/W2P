import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const { name } = getQuery(event)
  let qRes
  try {
    qRes = await query(
      `INSERT INTO app.collections(user_email, collection_name, created_by) 
        VALUES ($1, $2, $3) returning id`,
      [
        session.user.email,
        name,
        session.user.email
      ])
  } catch (e) {
    return {
      err: true,
      msg: "?"
    }
  }
  
  return {
    id: qRes.rows[0].id,
    collection_name: name,
    gameIDs: []
  }
})