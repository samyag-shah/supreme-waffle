import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";
import { Server as NetServer, Socket } from "net";
import messageHandler from "./../../utils/sockets";

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
      path: "/api/socket",
      addTrailingSlash: false,
    });

    // const onConnection = (socket: Socket) => {
    //   messageHandler(io, socket);
    // };

    // Define actions inside
    io.on("connection", (socket) => {
      //console.log("user is connected"),
      socket.on("message", (msg, callback) => {
        callback({ status: "ok" });
        io.emit("message", msg);
      }),
        //onConnection,
        socket.on("disconnect", () => {
          console.log("user is disconnected");
        });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io is already running");
  }
  res.end();
}
