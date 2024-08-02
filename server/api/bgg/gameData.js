
export default defineEventHandler(async (event) => {

  const query = getQuery(event)

  bggQuery(`thing?id=${gameIds.join()}&stats=1`)

  async function bggQuery(url, errTitle = "Error", errMsg = "Oops. Something went wrong") {
    try {
      const fullurl = "https://boardgamegeek.com/xmlapi2/" + url
      const { data, error } = await useFetch(fullurl)
      if (error.value) throw { message: 'BGG API Error: ', error }
      return fromXML(data.value)
    } catch (error) {
      console.warn('BGG API Error: ', error)
      throw error
    }
  }


})