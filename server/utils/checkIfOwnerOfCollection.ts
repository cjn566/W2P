import query from '../db'
import { StatusCodes } from 'http-status-codes';
export async function checkIfOwnerOfCollection(email: String, cId: number) {
    if((await query('SELECT user_email FROM app.collections WHERE id = $1', [cId])).rows[0].user_email !== email)
        throw createError({ statusCode: StatusCodes.FORBIDDEN, statusMessage: 'You are not the owner of this collection' })
}