// import "@/styles/globals.css";

import type { AppProps } from "next/app";

import { CssBaseline, GlobalStyles } from "@mui/material";

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
  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={styles} />
      <Component {...pageProps} />
    </>
  );
}
