import query from '../../db'
import { StatusCodes } from 'http-status-codes';

export default defineAuthenticatedEventHandler(async (event: any, session: any) => {
  const { cId } = await readBody(event)
  try {
    let result = await query('DELETE FROM app.collections WHERE id = $1 and user_email = $2', [cId, session.user.email])
    if (result.rowCount === 0) {
      log({level: 'warn', source: 'collection/remove', message: `Attempt to remove collection found no collections`, context: { cId, userEmail: session.user.email }})
      throw createError({ status: StatusCodes.NOT_FOUND, message: 'Collection not found' })
    }
  } catch (e) {
    log({level: 'error', source: 'collection/remove', message: `Remove collection query failed`, context: { cId, userEmail: session.user.email }})
    throw createError({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: `Unable to delete collection ${cId}` })
  }
})