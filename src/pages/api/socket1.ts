import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";
import { Server as NetServer, Socket } from "net";
import { createRouter } from "next-connect";
import crypto from "crypto";
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

class SessionStore {
  findSession(id: any) {}
  saveSession(id: any, session: any) {}
  findAllSession() {}
}

class InMemoerySessionStore extends SessionStore {
  sessions;
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id: any) {
    return this.sessions.get(id);
  }

  saveSession(id: any, session: any) {
    this.sessions.set(id, session);
  }

  findAllSession() {
    return [...this.sessions.values()];
  }
}

class MessageStore {
  saveMessages(message: any) {}
  findMessagesForUser(userID: any) {}
}

class InMemoryMessageStore extends MessageStore {
  messages: any[];
  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message: any): void {
    this.messages.push(message);
  }

  findMessagesForUser(userID: any) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

const sessionStore = new InMemoerySessionStore();
const messageStore = new InMemoryMessageStore();

interface NextApiResponseServerIo extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
}

interface NextApiRequest1 extends NextApiRequest {
  session?: any;
}

const randomId = () => crypto.randomBytes(8).toString("hex");
const router = createRouter<NextApiRequest1, NextApiResponseServerIo>();

router.all((req, res) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIoServer(httpServer as any, {
      path: "/api/socket1",
      addTrailingSlash: false,
      cookie: true,
    });

    io.use((socket, next) => {
      const sessionID = socket.handshake.auth.sessionID;
      console.log({ sessionID });
      if (sessionID) {
        const session = sessionStore.findSession(sessionID);
        console.log({ session });
        if (session) {
          (socket as any).sessionID = sessionID;
          (socket as any).userID = session.userID;
          (socket as any).username = session.username;
          return next();
        }
      }

      const username = socket.handshake.auth.username;
      if (!username) {
        return next(new Error("invalid username"));
      }

      (socket as any).sessionID = randomId();
      (socket as any).userID = randomId();
      (socket as any).username = username;
      (socket as any).connected = true;
      next();
    });

    // Define actions inside
    io.on("connection", (socket) => {
      console.log(`user is connected: ${socket.id}`);

      //persist session
      sessionStore.saveSession((socket as any).sessionID, {
        userID: (socket as any).userID,
        username: (socket as any).username,
        connected: true,
      });

      //emit session details
      socket.emit("session", {
        sessionID: (socket as any).sessionID,
        userID: (socket as any).userID,
        username: (socket as any).username,
      });

      //join the room
      socket.join((socket as any).userID);

      //fetch existing users and their messages
      const users: any[] = [];
      const messagesPerUser = new Map();

      //messsages
      messageStore
        .findMessagesForUser((socket as any).userID)
        .forEach((message) => {
          const { from, to } = message;
          //??
          const otherUser = (socket as any).userID === from ? to : from;
          if (messagesPerUser.has(otherUser)) {
            messagesPerUser.get(otherUser).push(message);
          } else {
            messagesPerUser.set(otherUser, [message]);
          }
        });
      console.log({ messageStore });
      //session
      console.log({ allSessions: sessionStore.findAllSession() });
      sessionStore.findAllSession().map((session) => {
        users.push({
          userID: session.userID,
          username: session.username,
          connected: session.connected,
          messages: messagesPerUser.get(session.userID) || [],
        });
      });

      //just inform to sender
      socket.emit("users", users);

      //notify existing users
      io.emit("user_connected", {
        userID: (socket as any).userID,
        username: (socket as any).username,
        connected: true,
        messages: [],
      });

      // forward the private message to the right recipient (and to other tabs of the sender)
      socket.on("private_message", ({ to, from, message }, callback) => {
        const message1 = {
          message,
          from: (socket as any).userID,
          to,
        };
        console.log({ message1 });
        callback();
        socket
          .to(to)
          .to((socket as any).userID)
          .emit("private_message", {
            message: message1,
            from,
            to,
          });
        messageStore.saveMessage(message1);
      });

      // notify users upon disconnection
      socket.on("disconnect", () => {
        console.log("user is disconnected", socket.id);
        (socket as any).connected = false;
        //notify other users
        socket.broadcast.emit("user_disconnected", (socket as any).userID);
        //update connection status of the session
        sessionStore.saveSession((socket as any).sessionID, {
          userID: (socket as any).userID,
          username: (socket as any).username,
          connected: false,
        });
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket1.io is already running");
  }
  res.end();
});

export default router.handler({
  onError: (err: unknown, req, res) => {
    //console.error(err.stack);
    //res.status(err.statusCode || 500).end(err.message);
    res.status(500).json({ status: 500, message: "somwthing went wrong" });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ status: 405, message: "no method found" });
  },
});
