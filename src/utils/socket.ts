import { io } from "socket.io-client";

//let URL = "http://localhost:3000";
let URL;
if (typeof window !== "undefined") {
  URL = window.location.origin;
}

export let socket = io(URL || "http://localhost:3000", {
  path: "/api/socket1",
  addTrailingSlash: false,
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export let socket1 = io(URL || "http://localhost:3000", {
  path: "/api/socket2",
  addTrailingSlash: false,
  autoConnect: false,
});

socket1.onAny((event, ...args) => {
  console.log(event, args);
});

export let socket2 = io(URL || "http://localhost:3000", {
  path: "/api/socket3",
  addTrailingSlash: false,
  autoConnect: false,
});

socket2.onAny((event, ...args) => {
  console.log(event, args);
});

export let socket3 = io(URL || "http://localhost:3000", {
  path: "/api/notification/notification",
  addTrailingSlash: false,
  autoConnect: false,
});

socket3.onAny((event, ...args) => {
  console.log(event, args);
});
