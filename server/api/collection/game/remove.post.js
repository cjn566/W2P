import { checkIfOwnerOfCollection } from '~/server/utils/checkIfOwnerOfCollection'
import { StatusCodes } from 'http-status-codes'
import query from '../../../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
  const { gameIDs, cId } = await readBody(event)
  checkIfOwnerOfCollection(session.user.email, cId)  
  if((await query('DELETE FROM app.games WHERE bgg_game_id = ANY($1) and collection_id = $2', [gameIDs, cId])).rowCount !== gameIDs.length) {
    throw createError({statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Not all games were removed'})
  }
})