import "@/styles/globals.css";

import type { AppProps } from "next/app";
// import type { Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";
import GlobalStyles from "@mui/material/GlobalStyles";

import { CssBaseline } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import RouteGuard from "../../components/protected/routeGurad";

interface userContextType {
  user: { result: string; ownername: string; phone: string; email: string };
  token: string;
}

let token = "";
let user = { result: "0" };

const userContextDefaultValue = {
  session: { user, token },
  setSession: (state: userContextType) => {},
};

export const UserContext = createContext(userContextDefaultValue);

const styles = {
  body: {
    overflow: "auto",
  },
  html: {
    overflow: "auto",
  },
};
export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  const [session, setSession] = useState(userContextDefaultValue.session);

  // useEffect(() => {
  //   token = localStorage.getItem("access_token") || "";
  //   let user = {};
  //   let b = localStorage.getItem("user");
  //   if (b !== null) {
  //     user = JSON.parse(b);
  //   }
  //   setSession({ ...session, user: { ...user, result: "1" }, token });
  // }, []);

  return (
    // <UserContext.Provider value={{ session, setSession }}>
    // <RouteGuard>
    <>
      <CssBaseline />
      <GlobalStyles styles={styles} />
      <Component {...pageProps} />
    </>
    // </RouteGuard>
    // </UserContext.Provider>
  );
}
