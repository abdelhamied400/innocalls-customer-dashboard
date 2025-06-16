import React, { useRef, useEffect, useState, useMemo } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "./ui/button";
import { Download, Pause, PlayArrow } from "@mui/icons-material";
import { format, formatDuration } from "date-fns";

interface SoundPlayerProps {
  url: string;
}

const SoundPlayer = ({ url }: SoundPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [playerStatus, setPlayerStatus] = useState<"playing" | "paused">(
    "paused"
  );
  const [duration, setDuration] = useState<number>(0);
  const formattedDuration = useMemo(
    () => formatDuration({ seconds: duration }),
    [duration]
  );

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#CCCCCC",
        progressColor: "#262626",
        height: 64,
        barGap: 2,
        barWidth: 2,
      });
      wavesurferRef.current.load(url);

      wavesurferRef.current.on("ready", () => {
        setDuration(wavesurferRef.current?.getDuration() || 0);
      });

      wavesurferRef.current.on("play", () => {
        setPlayerStatus("playing");
      });
      wavesurferRef.current.on("pause", () => {
        setPlayerStatus("paused");
      });
      wavesurferRef.current.on("finish", () => {
        setPlayerStatus("paused");
      });
    }
    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "audio.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        size="icon"
        variant="ghost-primary"
        className="w-16 h-16 flex items-center justify-center rounded-3xl [&_svg]:size-6"
        onClick={handleDownload}
      >
        <Download />
      </Button>
      <Button
        size="icon"
        variant={
          playerStatus === "playing" ? "ghost-destructive" : "ghost-success"
        }
        onClick={handlePlayPause}
        className="w-16 h-16 flex items-center justify-center rounded-3xl [&_svg]:size-6"
      >
        {playerStatus === "playing" ? <Pause /> : <PlayArrow />}
      </Button>

      <div
        ref={waveformRef}
        style={{ width: "100%", marginBottom: 8, flex: 1 }}
      />
    </div>
  );
};

export default SoundPlayer;
