import pg from 'pg'
 
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DEBUG? false : 
  {
    rejectUnauthorized: false
  }
})
 
export default async function query(text, params) {
    return await pool.query(text, params)
  }