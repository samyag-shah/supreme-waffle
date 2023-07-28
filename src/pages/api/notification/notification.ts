import { NextApiRequest, NextApiResponse } from "next";
import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";

import { Server as IOServer, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}
interface SocketWithIO extends NetSocket {
  server: SocketServer;
  userId: String;
}
interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}
interface Socket1 extends Socket {
  userId?: String;
}

const prisma = new PrismaClient();
export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server;
    const io = new IOServer(httpServer, {
      path: "/api/notification/notification",
      addTrailingSlash: false,
    });

    io.use((socket: Socket1, next) => {
      const userId = socket.handshake.auth.userId;
      if (!userId) {
        return next(new Error("userId is required"));
      }
      socket.userId = userId;
      next();
    });

    // Define actions inside
    io.on("connection", async (socket: Socket1) => {
      console.log(`user is connected: ${socket.id}`);

      const message1 = await prisma.notification.findFirst({
        where: {
          ownerId: socket.userId as string,
        },
      });

      console.log({ message1 });
      socket.emit("message_sent", message1, () => {
        console.log("message_sent");
      });

      //   socket.on("message_received", ({ ownerId, message }, callback) => {
      //     //console.log("message_received1");
      //     //console.log({ ownerId, message });
      //     callback({ result: "ok" });
      //     let obj = { ownerId, message };

      //     const message1 = prisma.notification.findFirst({
      //       where: {
      //         ownerId,
      //       },
      //     });

      //     console.log({ message1 });
      //     socket.emit("message_sent", message1, () => {
      //       console.log("message_sent");
      //     });
      //   });

      //   socket.emit("send_messages", () => {
      //     console.log("send_messages");
      //   });

      socket.on("disconnect", () => {
        console.log("user is disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket2.io is already running");
  }

  console.log({ req });
  res.json({ message: "hello" });
}
