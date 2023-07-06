import { Button } from "antd";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  author: string;
  message: string;
}
let socket: Socket;

export default function Home() {
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();
    socket.on("connect", () => {
      console.log("connect");
      socket.emit("hello");
    });
    // socket.on("hello", (data) => {
    //   console.log("connect", data);
    //   //socket.emit("hello")
    // });
    // socket.on("a user connected", () => {
    //   console.log("a user connected");
    // });
    // socket.on("disconnect", () => {
    //   console.log("disconnect");
    // });

    // socket.on("newIncomingMessage", (msg) => {
    //   setMessages(
    //     messages.concat({ author: msg.author, message: msg.message })
    //   );
    // });
  };

  const sendMessage = () => {
    socket.emit("createdMessage", { author: "first", message: "hello" });
  };

  return <Button onClick={sendMessage}>Click me</Button>;
}
