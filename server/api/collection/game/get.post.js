
import { getGameInfo } from '../../../utils/boardgamegeek'
export default defineEventHandler(async (event) => {
  return getGameInfo(await readBody(event))
})