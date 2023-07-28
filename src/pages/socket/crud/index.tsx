//import { socket2 } from "@/utils/socket";
import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Divider,
  Checkbox,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { socket2 } from "@/utils/socket";

interface Item {
  name: string;
  checked: boolean;
  id: number;
}

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState("");
  const [todoItem, setTodoItem] = useState("");
  const [todoItems, setTodoItems] = useState<Item[]>([]);

  //socket connect
  useEffect(() => {
    console.log("connected to socket", socket2.id);
    socket2.on("connect", () => {
      console.log("connected1 to socket", socket2.id);
      setConnected(true);
      setUserId(socket2.id);
    });

    socket2.onAny((event, ...args) => {
      console.log({ event, args });
    });

    socket2.on("todo:read", (message: Item) => {
      console.log({ message });
      setTodoItems((todoItems) => [...todoItems, message]);
    });
    socket2.on("todo:update", (id: number) => {
      console.log({ id });
      setTodoItems((todoItems) =>
        todoItems.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              checked: !item.checked,
            };
          }
          return item;
        })
      );
    });
    socket2.on("todo:delete", (id: number) => {
      console.log({ id });
      //console.log({ todoItems });
      // const todoItems1 = todoItems.filter((item) => {
      //   item.id !== id;
      // });
      console.log({ todoItems });
      setTodoItems((todoItems) => {
        let item = todoItems.filter((item) => item.id !== id);
        console.log({ item });
        return item;
      });
    });

    return () => {
      socket2.disconnect();
      console.log("disconnected to socket");
    };
  }, []);

  const handleAddTodo = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter") {
      let item = { name: todoItem, checked: false, id: Date.now() };
      //setTodoItems([...todoItems, item]);
      socket2.emit("todo:create", item, (result: any) => {
        console.log({ result });
        setTodoItem("");
      });
    }
  };

  const handleItemClick = (id: number) => {
    console.log({ id });
    // setTodoItems(
    //   todoItems.map((item) => {
    //     if (item.id === id) {
    //       return {
    //         ...item,
    //         checked: !item.checked,
    //       };
    //     }
    //     return item;
    //   })
    // );
    socket2.emit("todo:update", id, (result: any) => {
      console.log({ result });
    });
  };

  const handleItemDelete = (id: number) => {
    //console.log({ id });
    // setTodoItems(
    //   todoItems.filter((item) => {
    //     item.id !== id;
    //   })
    // );
    socket2.emit("todo:delete", id, (result: any) => {
      console.log({ result });
    });
  };

  return (
    <Stack sx={{ border: "1px solid", height: "100vh" }} alignItems="center">
      <Typography variant="h4" p={0.3}>
        todos
      </Typography>
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
            <TextField
              value={todoItem}
              onChange={(e) => setTodoItem(e.target.value)}
              fullWidth
              onKeyUp={handleAddTodo}
              placeholder="What needs to be done?"
            />
            <Divider />

            <div>
              {todoItems.map((item: Item, index: number) => (
                <Stack
                  key={index}
                  direction="row"
                  border={"1px solid"}
                  alignItems={"center"}

                  // alignItems={
                  //   socket2.id === data.roomId ? "flex-end" : "flex-start"
                  // }
                >
                  <Checkbox
                    onClick={() => handleItemClick(item.id)}
                    checked={item.checked}
                  ></Checkbox>
                  <Typography
                    onClick={() => handleItemClick(item.id)}
                    p={2}
                    flexGrow={1}
                    sx={{
                      textDecoration: item.checked ? "line-through" : "none",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <IconButton
                    sx={{ mr: 2 }}
                    onClick={() => handleItemDelete(item.id)}
                  >
                    <ClearIcon />
                  </IconButton>
                </Stack>
              ))}{" "}
            </div>
          </Box>
        </Stack>
      </Box>
      {/* <button onClick={() => socket2.disconnect()}>Disconnect</button> */}
    </Stack>
  );
}
