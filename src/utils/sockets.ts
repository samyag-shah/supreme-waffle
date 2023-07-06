import { Socket } from "socket.io";

export default (io, socket: Socket) => {
  const createdMessage = (msg) => {
    console.log({ msg });
    socket.broadcast.emit("newIncommingMesssage", msg);
  };

  socket.on("createdMessage", createdMessage);
};
