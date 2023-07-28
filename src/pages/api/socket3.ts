import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";
import { Server as NetServer, Socket } from "net";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface NextApiResponseServerIo extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIoServer(httpServer as any, {
      path: "/api/socket3",
      addTrailingSlash: false,
    });

    // Define actions inside
    io.on("connection", (socket) => {
      console.log(`user is connected: ${socket.id}`);
      socket.on("todo:create", (data, callback) => {
        callback({ ok: true });
        io.emit("todo:read", data);
      });
      socket.on("todo:update", (id, callback) => {
        callback({ ok: true });
        io.emit("todo:update", id);
      });
      socket.on("todo:delete", (id, callback) => {
        callback({ ok: true });
        io.emit("todo:delete", id);
      });
      //   socket.on("todo:read", () => {
      //   });
      //   socket.on("todo:list", () => {
      //   });
      socket.on("disconnect", () => {
        console.log("user is disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket3.io is already running");
  }
  res.end();
}
