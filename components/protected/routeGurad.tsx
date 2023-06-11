import { UserContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { ReactNode, useContext, useEffect, useState } from "react";

const RouteGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const [userSet, setUserSet] = useState<boolean | "undefined">();

  const value = useContext(UserContext);

  // useEffect(() => {
  //   if (value.session.user.result === "1") {
  //     if ("ownername" in value?.session?.user) {
  //       setUserSet(true);
  //     } else {
  //       console.log("hello1");
  //       setUserSet(false);
  //     }
  //   }
  // }, [value]);

  // useEffect(() => {
  //   if (userSet === true || userSet === false) {
  //     //if (value.session.user.result === "1") {
  //     console.log("hello2");
  //     //on initial load

  //     if ("ownername" in value?.session?.user) {
  //       authCheck(router.asPath, true);
  //     } else {
  //       authCheck(router.asPath, false);
  //     }

  //     //on route change start
  //     const hideContent = () => setAuthorized(false);
  //     router.events.on("routeChangeStart", hideContent);

  //     //on route change complete
  //     router.events.on("routeChangeComplete", authCheck);

  //     //unsubscribe from events
  //     return () => {
  //       router.events.off("routeChangeStart", hideContent);
  //       router.events.off("routeChangeComplete", authCheck);
  //     };
  //   }
  // }, [userSet]);

  // function authCheck(url: string, userSet: boolean) {
  //   //if user is set we redirect user to home page
  //   const publicPaths = [
  //     "owner/signin",
  //     "owner/signup",
  //     "user/signup",
  //     "user/signin",
  //     "",
  //   ];
  //   const publicPaths1 = [
  //     "owner/signin",
  //     "owner/signup",
  //     "user/signup",
  //     "user/signin",
  //   ];
  //   const path = url.slice(1);
  //   console.log({ userSet, url, path });

  //   // if (userSet && publicPaths1.includes(path)) {
  //   //   router.push({
  //   //     pathname: "/",
  //   //     //query: { returnUrl: router.asPath },
  //   //   });
  //   // }

  //   if (!userSet && !publicPaths.includes(path)) {
  //     setAuthorized(false);
  //     console.log("hello3");
  //     router.push({
  //       pathname: "/owner/signin",
  //       query: { returnUrl: router.asPath },
  //     });
  //   } else {
  //     setAuthorized(true);
  //     console.log("hello4");
  //     //console.log({ router });
  //     //   let url = router.query.returnUrl || '/'
  //     //   router.push({
  //     //     pathname:  url
  //     //     //query: { returnUrl: router.asPath },
  //     //   });
  //   }
  // }

  //return <>{authorized && children}</>;
  return <>{children}</>;
};

export default RouteGuard;
