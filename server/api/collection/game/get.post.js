
import { StatusCodes } from 'http-status-codes'
import { getGameInfo } from '../../../utils/boardgamegeek'
export default defineEventHandler(async (event) => {
  let IDs = await readBody(event)  
  if (!IDs || (Array.isArray(IDs) && IDs.some(id => id == null))) {
    throw createError({statusCode: StatusCodes.BAD_REQUEST, statusMessage: 'Invalid game ID(s)'})
  }  
  return getGameInfo(IDs)
})