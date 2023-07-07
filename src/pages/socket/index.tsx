import { Button, Input, Spin } from "antd";
import { Fragment, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  userName: string;
  message: string;
}
let socket: Socket;

export default function Home() {
  const [connected, setConnected] = useState(false);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userNameInput, setUserNameInput] = useState("");
  const [userName, setUserName] = useState("");
  const [messageInput, setMessageInput] = useState("");

  //initiate connection
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    socket = new (io as any)("http://localhost:3000", {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    socket.on("connect", () => {
      console.log("connected to socket");
      setConnected(true);
    });
    socket.on("message", (message: Message) => {
      console.log({ message });
      chatMessages.push(message);
      setChatMessages([...chatMessages]);
    });
    if (socket) return () => socket.disconnect();
  };

  // dispatch message to other user
  // const sendApiSocketChat = async (chatMessage: Message): Promise<Response> => {
  //   return await fetch("/api/chat", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(chatMessage),
  //   });
  // };

  const sendMessage = async () => {
    if (messageInput) {
      const chatMessage: Message = {
        userName,
        message: messageInput,
      };
      //const resp = await sendApiSocketChat(chatMessage);
      socket.emit("message", chatMessage, (response: any) => {
        //console.log({ err });
        console.log({ status: response?.status });
      });
      setMessageInput("");
      //if (resp.ok) setMessageInput("");
    }
  };

  const sendEnterRoomMessage = async () => {
    const chatMessage: Message = {
      userName,
      message: `${userName} enter to chat room`,
    };

    socket.emit("message", chatMessage);
    setMessageInput("");
    //const resp = await sendApiSocketChat(chatMessage);
    // if (!resp.ok) {
    //   setTimeout(() => {
    //     sendEnterRoomMessage();
    //   }, 500);
    // }
  };

  useEffect((): any => {
    if (userName) {
      sendEnterRoomMessage();
    }
  }, [userName]);

  if (!connected) {
    return <Spin />;
  }

  if (!userName) {
    return (
      <Input
        name="username"
        value={userNameInput}
        placeholder="username"
        onKeyUp={(e) => {
          if (e.key === "Enter") setUserName(userNameInput);
        }}
        onChange={(e) => setUserNameInput(e.target.value)}
      />
    );
  }

  // console.log({ chatMessages });
  return (
    <>
      <h1>Chat Application</h1>
      {chatMessages.length ? (
        chatMessages.map((chatMessage, index) => (
          <Fragment key={index}>
            <p>{chatMessage?.userName}</p>
            <p>{chatMessage?.message}</p>
          </Fragment>
        ))
      ) : (
        <p>No message</p>
      )}
      <Input
        name="message"
        value={messageInput}
        placeholder="message name"
        onKeyUp={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        onChange={(e) => setMessageInput(e.target.value)}
      />
    </>
  );
}
