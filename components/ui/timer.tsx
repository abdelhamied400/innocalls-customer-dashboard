import { useEffect, useState } from "react";

type TimerProps = {
  startingTime?: number;
  timestamp?: number;
};

const secondsToDuration = (seconds: number) => {
  const absSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;

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

const getElapsedSeconds = (timestamp: number) =>
  Math.floor((Date.now() - timestamp * 1000) / 1000);

const Timer = ({ startingTime, timestamp }: TimerProps) => {
  const [time, setTime] = useState(() =>
    timestamp ? getElapsedSeconds(timestamp) : (startingTime ?? 0)
  );

  useEffect(() => {
    if (timestamp) {
      setTime(getElapsedSeconds(timestamp));
    } else if (startingTime !== undefined) {
      setTime(startingTime);
    }
  }, [startingTime, timestamp]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timestamp) {
        setTime(getElapsedSeconds(timestamp));
      } else {
        setTime((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startingTime, timestamp]);

  return secondsToDuration(time);
};

export default Timer;
