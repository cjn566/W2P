import query from '../db'
export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    console.error("Reported: ", body)
    // const qRes = await query('DELETE FROM app.games WHERE id = $1', [userGameId])

})