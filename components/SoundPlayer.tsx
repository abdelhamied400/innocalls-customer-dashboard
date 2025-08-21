import React, { useRef, useEffect, useState, useMemo } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "./ui/button";
import { Download, Pause, PlayArrow } from "@mui/icons-material";
import { downloadFile } from "../lib/downloadFile";
import { formatDuration } from "@/lib/date";
import { Skeleton } from "./ui/skeleton";
import Spinner from "./ui/spinner";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);

  useEffect(() => {
    if (waveformRef.current) {
      setLoading(true);
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
        setLoading(false);
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
        <div className="flex items-center gap-2">
          {loading && <Spinner className="w-4" />}
          <p className="text-gray-500 text-sm">{formattedDuration}</p>
        </div>
      </div>
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost-primary"
            className="w-16 h-16 flex items-center justify-center rounded-3xl [&_svg]:size-6"
            onClick={handleDownload}
            loading={downloadLoading}
            disabled={loading}
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
            disabled={loading}
          >
            {playerStatus === "playing" ? <Pause /> : <PlayArrow />}
          </Button>
        </div>
        {loading && <WaveformLoader />}
        <div
          ref={waveformRef}
          style={{ width: "100%", marginBottom: 8, flex: loading ? 0 : 1 }}
        />
      </div>
    </div>
  );
};

const WaveformLoader = ({ bars = 42, color = "bg-gray-300" }) => {
  // Generate an array with symmetric indexes around the center
  const half = Math.floor(bars / 2);
  const indices = [...Array(bars)].map((_, i) => i - half);

  return (
    <div className="flex items-center justify-center gap-[3px] h-12">
      {indices.map((offset, i) => {
        const delay = (Math.random() * 1).toFixed(2); // random 0–1s delay
        const duration = (1 + Math.random()).toFixed(2); // random 1–2s duration
        return (
          <div
            key={i}
            className={`w-0.5 h-full ${color} rounded-full animate-wave`}
            style={{
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default SoundPlayer;
