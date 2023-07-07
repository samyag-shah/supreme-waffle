import { Socket, Server } from "socket.io";

export default (io: Server, socket: Socket) => {
  const createdMessage = (msg: any) => {
    socket.broadcast.emit("newIncommingMesssage", msg);
  };

  socket.on("createdMessage", createdMessage);
};
