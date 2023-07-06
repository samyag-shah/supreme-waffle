import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";
//import messageHandler from "./../../utils/sockets";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //console.log({ socket:  });
  if (!res.socket?.server?.io) {
    const io = new Server(res.socket?.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    // const onConnection = (socket: Socket) => {
    //   messageHandler(io, socket);
    // };

    // Define actions inside
    io.on("connection", (socket) => {
      console.log("user is connected");
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
