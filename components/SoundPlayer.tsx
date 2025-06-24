import React, { useRef, useEffect, useState, useMemo } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "./ui/button";
import { Download, Pause, PlayArrow } from "@mui/icons-material";
import { downloadFile } from "../lib/downloadFile";
import { formatDuration } from "@/lib/date";

interface SoundPlayerProps {
  url: string;
  label?: string | null;
}

const SoundPlayer = ({ label, url }: SoundPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [playerStatus, setPlayerStatus] = useState<"playing" | "paused">(
    "paused"
  );
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);

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

  const handleDownload = async () => {
    setDownloadLoading(true);
    await downloadFile(url, label || "audio.mp3");
    setDownloadLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-gray-500 text-sm">{formattedDuration}</p>
      </div>
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost-primary"
            className="w-16 h-16 flex items-center justify-center rounded-3xl [&_svg]:size-6"
            onClick={handleDownload}
            loading={downloadLoading}
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
        </div>

        <div
          ref={waveformRef}
          style={{ width: "100%", marginBottom: 8, flex: 1 }}
        />
      </div>
    </div>
  );
};

export default SoundPlayer;
