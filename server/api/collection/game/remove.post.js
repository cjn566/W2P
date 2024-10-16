import query from '../../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  /*  Possible Problems
    Collection doesn't belong to user
    Game IDs don't belong to collection
    Game IDs don't exist    
   */
  const { gameIDs, cId } = await readBody(event)

  let userOwnsC = (await query('SELECT user_email FROM app.collections WHERE id = $1', [cId])).rows[0].user_email === session.user.email

  if (!userOwnsC) {
    return {
      err: true,
      msg: "Unauthorized"
    }
  }
  
  await query('DELETE FROM app.games WHERE bgg_game_id = ANY($1) and collection_id = $2', [gameIDs, cId])
  return gameIDs

})