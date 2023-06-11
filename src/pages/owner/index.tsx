import { useContext } from "react";
import { UserContext } from "../_app";

export default function Home() {
  // const value = useContext(UserContext);

  // let ownername: string = "";
  // if ("ownername" in value.session.user) {
  //   ownername = value.session.user.ownername as string;
  // }

  return (
    <>
      <p>Owner Dashboard</p>
      {/* <p>Owner name : {ownername}</p> */}
    </>
  );
}
