import { socket3 } from "@/utils/socket";
import { Button } from "antd";
import { useEffect, useState } from "react";

interface Data {
  ownerId: String;
  message: String;
}
const ReceiveNotification = () => {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState<Data>();

  useEffect(() => {
    socket3.auth = { userId: "cljctjw9b0000uzv4u43q205a" };
    socket3.connect();
    socket3.on("connect", () => {
      //setConnected(true);
      console.log("connected", socket3.id);
      //sendMessage();
    });

    socket3.on("connect_error", (err) => {
      console.error("connected", err);
    });
    socket3.on("message_sent", (data) => {
      console.log(data);
    });

    return () => {
      socket3.disconnect();
      socket3.removeAllListeners();
    };
  }, []);

  //   const sendMessage = () => {
  //     console.log("hello");
  //     console.log({ data });

  //     //socket3.disconnect();
  //   };

  //   useEffect(() => {
  //     if (data) {
  //       socket3.auth = { userId: "cljctjw9b0000uzv4u43q205a" };
  //       socket3.connect();
  //       console.log({ data });
  //       socket3.emit("message_received", data, (result: any) => {
  //         console.log(result);
  //         console.log(result.result === "ok");
  //         if (result.result === "ok") {
  //           socket3.disconnect();
  //         }
  //       });
  //     }
  //     return () => {
  //       //socket3.disconnect();
  //       socket3.removeAllListeners();
  //     };
  //   }, [data]);

  //   const sendNotification = async () => {
  //     // const response = await fetch("/api/notification/notification", {
  //     //   method: "POST",
  //     //   body: JSON.stringify({
  //     //     ownerId: "cljctjw9b0000uzv4u43q205a",
  //     //     message: "Hi",
  //     //   }),
  //     // });
  //     // const result = await response;
  //     // console.log({ result });

  //     setData({ ownerId: "cljctjw9b0000uzv4u43q205a", message: "hello" });
  //   };

  return <Button>Notification</Button>;
};

export default ReceiveNotification;
