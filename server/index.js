import dotenv from "dotenv";
// import connectDB from "./db/index.js";
import sql from "./db/database.js";
import http from "http";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? "./.env.production" : "./.env",
  override: true,
});

const PORT = process.env.PORT || 5000;

const { default: app } = await import("./app.js");
const { initSocket } = await import("./config/socket.js");

const server = http.createServer(app);

initSocket(server);

async function startServer() {
  try {
    await sql`SELECT 1`;
    // startup logs removed for production
    server.listen(PORT, "0.0.0.0", () => {});
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
}

startServer();
