
import pkg, { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()
const pool = new Pool({
    user : process.env.PGUSER,
    host : process.env.PGHOST,
    database : process.env.PGDATABASE,
    password : process.env.PGPASSWORD,
    port :process.env.PGPORT,
    // connectionString : process.env.DB_URL,
    // ssl : {
    //     rejectUnauthorized : false //LOCALHOST DB does not need "ssl" others do
    // }
})

export default pool;