import { useEffect, useState } from "react";

type CallTimerProps = {
  startTime: number | null; // Unix timestamp when call started
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

const CallTimer = ({ startTime }: CallTimerProps) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Return 0:00 if no start time
  if (!startTime) {
    return "0:00";
  }

  // Calculate elapsed time based on start time
  const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

  return secondsToDuration(elapsedSeconds);
};

export default CallTimer;
