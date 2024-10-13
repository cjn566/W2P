import query from '../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const { name, cId } = await readBody(event)
  try {
    const qRes = await query(
      `UPDATE app.collections
        SET collection_name = $2, modified_by = $3
        WHERE id = $1`,
      [
        cId,
        name,
        session.user.email
      ])
  } catch (e) {
    // TODO: cleanup
    const res = {
      err: true,
      msg: "?"
    }
    return res
  }
  return {name}
})