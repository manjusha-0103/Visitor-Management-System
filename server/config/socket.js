import { Server } from "socket.io";
// import { getAppointments } from "../sockets/appointments.socket.js";
import { processtBirthday } from "../contollers/notificationController.js";
import { notifyBirthday } from "../sockets/notify.socket.js";
import cron from "node-cron";
import { getAllowedOrigins } from "./runtimeUrls.js";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // getAppointments(socket, io)

    socket.on("disconnect", (reason) => {
      // connection closed
    });
  });
};

const getIO = () => io;

cron.schedule("0 9 * * *", async () => {
  // cron.schedule("*/25 * * * * *", async () => {

  // Running scheduled birthday cron

  const users = await processtBirthday();
  await notifyBirthday(io, users);
});

export { initSocket, getIO };
