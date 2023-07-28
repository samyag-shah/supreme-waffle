import { socket1 } from "@/utils/socket";
import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";

interface Message {
  roomId: string;
  //room: string;
  userName: string;
  message: string;
  time: string;
}

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState("");

  const [chatMessages, setChatMessages] = useState<Array<Message>>([]);
  const [userName, setUserName] = useState("");
  const [messageInput, setMessageInput] = useState("");

  //socket connect
  useEffect(() => {
    socket1.connect();
    console.log("connected to socket", socket1.id);
    socket1.on("connect", () => {
      console.log("connected1 to socket", socket1.id);
      setConnected(true);
      setUserId(socket1.id);
    });

    socket1.on("receive_message", (message: Message) => {
      setChatMessages((chatMessages) => [...chatMessages, message]);
    });

    return () => {
      socket1.disconnect();
      console.log("disconnected to socket");
    };
  }, []);

  const handleSendMessage = async () => {
    if (messageInput) {
      const messageData = {
        roomId: socket1.id,
        //room,
        userName,
        message: messageInput,
        time: `${new Date().getHours()} : ${new Date().getMinutes()}`,
      };

      //console.log({ messageData, chatMessages });
      //setChatMessages([...chatMessages, messageData]);
      await socket1.emit("send_message", messageData, (result: any) => {
        console.log({ result });

        setMessageInput("");
      });
    }
  };

  return (
    <Stack sx={{ border: "1px solid" }} alignItems="center">
      <Box>
        <video width="500" height="300" controls>
          <source src="/Eminem.mp4" type="video/mp4"></source>
          Your browser does not support the video tag.
        </video>
      </Box>
      <Box>
        <Stack
          sx={{
            border: "1px solid",
            height: "500px",
            width: "500px",
            overflowY: "auto",
          }}
          position="relative"
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography border={"1px solid"} p={1}>
              Live Chat
            </Typography>
            <Divider />
            <div>
              {chatMessages.map((data: Message, index: number) => (
                <Stack
                  key={index}
                  alignItems={
                    socket1.id === data.roomId ? "flex-end" : "flex-start"
                  }
                >
                  <Typography p={0.3} width={"300px"} border={"1px solid"}>
                    {data.message}
                  </Typography>
                  <Stack
                    direction={"row"}
                    width={"300px"}
                    gap={1}
                    justifyContent={"flex-end"}
                  >
                    <Typography variant="caption">{data.userName}</Typography>
                    <Typography variant="caption">{data.time}</Typography>
                  </Stack>
                </Stack>
              ))}{" "}
            </div>
          </Box>
          <Stack direction="row" position="sticky" bottom={0}>
            <TextField
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              size="small"
              fullWidth
            />
            <Button
              sx={{ width: "250px" }}
              variant="outlined"
              onClick={handleSendMessage}
            >
              Send Message
            </Button>
          </Stack>
        </Stack>
      </Box>
      <button onClick={() => socket1.disconnect()}>Disconnect</button>
    </Stack>
  );
}
