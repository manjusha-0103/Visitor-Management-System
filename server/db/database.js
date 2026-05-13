import postgres from 'postgres'
import dotenv from "dotenv"
dotenv.config();  

// console.log("process.env.DATABASE_URL", process.env.DATABASE_URL)
const connectionString = process.env.DATABASE_URL
// console.log(connectionString)
const sql = postgres(connectionString)

export default sql