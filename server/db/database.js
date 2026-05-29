// import postgres from "postgres";
// import dotenv from "dotenv";
// dotenv.config({
//   path: process.env.NODE_ENV === "production" ? "./.env.production" : "./.env",
//   override: true,
// });

// // console.log("process.env.DATABASE_URL", process.env.DATABASE_URL)
// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   console.error("❌ DATABASE_URL is not set in environment variables.");
//   process.exit(1);
// }
// // console.log(connectionString)
// const sql = postgres(connectionString);

// export default sql;

import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? "./.env.production" : "./.env",
  override: true, 
});

// console.log("process.env.DATABASE_URL", process.env.DATABASE_URL)
const connectionString = process.env.POSGRES_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment variables.");
  process.exit(1);
}
// console.log(connectionString)
const sql = postgres(connectionString);

export default sql;