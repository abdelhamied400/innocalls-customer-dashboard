import { useEffect, useState } from "react";

type TimerProps = {
  startingTime: number;
};

const secondsToDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  } else {
    return `0:${secs.toString().padStart(2, "0")}`;
  }
};

const Timer = ({ startingTime }: TimerProps) => {
  const [time, setTime] = useState(startingTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return secondsToDuration(time);
};

export default Timer;
