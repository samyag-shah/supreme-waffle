import { useRouter } from "next/router";
import { useEffect } from "react";

const BoxCricket = () => {
  const router = useRouter();
  console.log({ router });

  useEffect(() => {}, []);
  return <>{router.query.boxCricketId}</>;
};

export default BoxCricket;
