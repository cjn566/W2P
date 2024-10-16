import pg from 'pg'
 
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DEBUG? false : 
  {
    rejectUnauthorized: false
  }
})

export default async function query(text: string, params?: any[]): Promise<pg.QueryResult> {
  return await pool.query(text, params)
}