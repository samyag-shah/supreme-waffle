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
      path: "/api/socket2",
      addTrailingSlash: false,
    });

    // Define actions inside
    io.on("connection", (socket) => {
      console.log(`user is connected: ${socket.id}`);

      socket.on("send_message", (data, callback) => {
        callback({ ok: true });
        //console.log({ data });
        io.emit("receive_message", data);
        //socket.to(data.room).emit("receive_message", data);
        //socket.emit("receive_message", data);
      });

      //   socket.on("join_room", (data, callback) => {
      //     socket.join(data);
      //     console.log(`user with ID ${socket.id} joined room: ${data}`);
      //     callback({ ok: true });
      //   });

      socket.on("disconnect", () => {
        console.log("user is disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket2.io is already running");
  }
  res.end();
}
