
// import { processBggData } from '@/server/utils/boardgamegeek'

export default defineEventHandler(async (event) => {

  const query = getQuery(event)
  try {
    return gameSearch(query.text, query.type, (query.exact === 'true'), parseInt(query.limit))
  } catch (error) {
    console.warn('Game Search Error: ', error)
    throw error
  }
})