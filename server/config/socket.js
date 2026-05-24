import { Server } from "socket.io";
// import { getAppointments } from "../sockets/appointments.socket.js";
import { processtBirthday } from "../contollers/notificationController.js";
import { notifyBirthday } from "../sockets/notify.socket.js";
import cron from 'node-cron'


let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
        origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        // getAppointments(socket, io)
        

        socket.on("disconnect", (reason) => {
            console.log("Disconnected:", reason)
        })
    });
  
};

const getIO = () => io;

cron.schedule("0 9 * * *", async () => {
// cron.schedule("*/5 * * * * *", async () => {

  console.log("Running Birthday Cron");

  const users = await processtBirthday();
  await notifyBirthday(io, users)
});

export{ initSocket, getIO };