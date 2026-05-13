
import dotenv from "dotenv"
// import connectDB from "./db/index.js";
import app from './app.js'
import sql from "./db/database.js";
import http from "http"
import {initSocket} from "./config/socket.js"

dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


initSocket(server)


async function startServer() {
  try {
    await sql`SELECT 1`;
    console.log("✅ Database Connected");

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    

  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
}

startServer();

