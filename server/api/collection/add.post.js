import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const body = await readBody(event)
  const ress = await Promise.all(body.map(async (new_collection_name) => {
    try {
      const qRes = await query(
        `INSERT INTO app.collections(user_email, collection_name, created_by) 
        VALUES ($1, $2, $3)
         on CONFLICT (id) DO UPDATE 
         SET collection_name = $2,
         modified_by = $3 returning id`,
        [
          session.user.email,
          new_collection_name,
          session.user.email
        ])
      return {
        err: false,
        newID: qRes.rows[0].id,
        new_collection_name
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