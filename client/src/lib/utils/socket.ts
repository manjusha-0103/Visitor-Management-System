import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? window.location.origin;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionAttempts: 10,
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Error:", error.message);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
