import query from '../db'
export default defineAuthenticatedEventHandler(async (event, session) => {
//export default defineEventHandler(async (event, session) => {
    console.log("\nHELLO API\n")
    // const res = (await query('SELECT * FROM app.games WHERE id = $1', [2])).rows[0]
    return {
      hello: "world"
    }
  })