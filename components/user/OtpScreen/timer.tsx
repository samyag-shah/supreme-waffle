import { useEffect, Dispatch, SetStateAction } from "react";

const Timer = ({
  t1,
  setT1,
}: {
  t1: number;
  setT1: Dispatch<SetStateAction<number>>;
}) => {
  useEffect(() => {
    let timerId: NodeJS.Timer;
    if (t1 > 0) {
      timerId = setInterval(() => setT1(t1 - 1), 1000);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [t1]);

  return <></>;
};

export default Timer;
