import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface Message {
  from: string;
  to: string;
  message: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState({
    username: "",
    userID: "",
    connected: false,
    messages: [],
  });
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      setSession(sessionID);
    }
  }, []);

  useEffect(() => {
    //connection_error
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        console.error(err);
      }
    });

    //connection success
    socket.on("connect", () => {
      console.log("connected to socket", socket.id);
    });

    //attach sessionID
    socket.on("session", ({ sessionID, userID, username }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      (socket as any).userID = userID;

      setSession(sessionID);
      setSelectedUser(userID);
      setUser((user) => ({ ...user, username, userID, connected: true }));
    });

    socket.on("users", (users) => {
      setUsers(users);
    });
    socket.on("private_message", (message: Message) => {
      console.log({ message });
      setChatMessages((chatMessages) => [...chatMessages, message]);
    });

    socket.on("user_connected", (user1) => {
      setUsers((users) => {
        let user = users.find((user) => user?.userID === user1?.userID);
        if (user) {
          return [...users];
        } else {
          return [...users, user1];
        }
      });
    });

    socket.on("user_disconnected", (userID) => {
      setUsers((users) => {
        const users1 = users.map((user) => {
          if (user?.userID === userID) {
            return { ...user, connected: false };
          }
          return user;
        });
        return users1;
      });
    });

    socket.on("disconnect", () => {
      setUser((user) => ({ ...user, connected: false }));
    });

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (users.length) {
      const messages = users.find(
        (user1) => user1.userID === user.userID
      ).messages;
      console.log({ messages });
      setChatMessages(messages);
    }
  }, [users]);

  const handleSendMessage = async () => {
    //sending message to others
    if (messageInput && selectedUser) {
      const messageData = {
        to: selectedUser,
        from: user.userID,
        message: messageInput,
      };

      socket.emit("private_message", messageData, (result: any) => {
        setChatMessages((chatMessages) => [...chatMessages, messageData]);
        setMessageInput("");
      });
    }
    //sending message to your self
    else if (messageInput) {
      const messageData = {
        to: user.userID,
        from: user.userID,
        message: messageInput,
      };

      socket.emit("private_message", messageData, (result: any) => {
        setChatMessages((chatMessages) => [...chatMessages, messageData]);
        setMessageInput("");
      });
    }
  };

  //connection of current user
  const handleConnect = () => {
    if (username) {
      const sessionID = localStorage.getItem("sessionID");
      if (sessionID) {
        socket.auth = { sessionID };
      }
      socket.auth = { username };
      socket.connect();
    }
  };

  //chat of user
  const handleChatUser = (Id: string) => {
    setSelectedUser(Id);
  };

  const findOwner = (from: any) => {
    let user1 = users.find((user) => user.userID === from);
    console.log({ user1 });
    if (user1) {
      if (from === user.userID) {
        return "You";
      } else {
        return user1.username;
      }
    }
    return "";
  };

  console.log({
    check: selectedUser === user?.userID,
    chatMessages,
    username,
    users,
    user,
    selectedUser,
  });
  return (
    <>
      {!session && (
        <Stack
          direction={"row"}
          height="100vh"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <TextField
            value={username}
            size="small"
            placeholder="Your username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" onClick={handleConnect}>
            Send
          </Button>
        </Stack>
      )}
      {session && (
        <>
          <Drawer
            anchor={"left"}
            open={true}
            hideBackdrop={true}
            sx={{ width: "200px" }}
            PaperProps={{ sx: { width: "250px" } }}
            //onClose={toggleDrawer(anchor, false)}
            variant="permanent"
          >
            <Stack>
              <Typography p={2}>Connected Users</Typography>
              <Divider />
              <List>
                {users.map((user1) => (
                  <ListItem key={user1?.userID}>
                    <ListItemButton
                      sx={{
                        display: "block",
                        backgroundColor:
                          selectedUser === user1?.userID ? "#ddd" : "white",
                      }}
                      onClick={() => handleChatUser(user1?.userID)}
                    >
                      {user1?.username}
                      {user1?.userID === user?.userID ? " (You)" : ""}
                      <ListItemText>{user1?.userID}</ListItemText>
                      <ListItemText>
                        {user1?.connected ? "online" : "offline"}
                      </ListItemText>
                      <ListItemText>{socket?.id}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Stack>
            <button
              onClick={() => {
                socket.disconnect();
              }}
            >
              disconnect
            </button>
          </Drawer>

          <Box ml={"250px"}>
            <Typography p={2}>
              {selectedUser
                ? users.find((user) => user.userID === selectedUser)?.username
                : "You"}
            </Typography>
            <Divider />
            <Typography p={2}>Chat</Typography>
            <Divider />

            <Box p={2}>
              {chatMessages.map((message, index) => (
                <Box key={index}>
                  <p>{`${message.message} (${findOwner(message.from)})`}</p>
                </Box>
              ))}
            </Box>

            <Box p={2}>
              <TextField
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                multiline
                placeholder="Type a message"
              />
              <Button variant="contained" onClick={handleSendMessage}>
                Send
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
