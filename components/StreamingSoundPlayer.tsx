import React, { useRef, useEffect, useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Download, Pause, PlayArrow, VolumeUp } from "@mui/icons-material";
import { downloadFile } from "../lib/downloadFile";
import { formatDuration } from "@/lib/date";
import Spinner from "./ui/spinner";

interface StreamingSoundPlayerProps {
  url: string;
  label?: string | null;
}

const StreamingSoundPlayer = ({ label, url }: StreamingSoundPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [playerStatus, setPlayerStatus] = useState<"playing" | "paused">("paused");
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [canPlay, setCanPlay] = useState<boolean>(false);

  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);
  const formattedCurrentTime = useMemo(() => formatDuration(currentTime), [currentTime]);
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration ? (buffered / duration) * 100 : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setLoading(true);
      setCanPlay(false);
    };

    const handleCanPlay = () => {
      setCanPlay(true);
      setLoading(false);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        setBuffered(bufferedEnd);
      }
    };

    const handlePlay = () => {
      setPlayerStatus("playing");
    };

    const handlePause = () => {
      setPlayerStatus("paused");
    };

    const handleEnded = () => {
      setPlayerStatus("paused");
      setCurrentTime(0);
    };

    const handleError = () => {
      setLoading(false);
      console.error("Error loading audio");
    };

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("progress", handleProgress);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("progress", handleProgress);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [url]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    if (playerStatus === "playing") {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercentage = clickX / rect.width;
    const newTime = clickPercentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleDownload = async () => {
    setDownloadLoading(true);
    await downloadFile(url, label || "audio.mp3");
    setDownloadLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        className="hidden"
      />
      
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{label}</p>
        <div className="flex items-center gap-2">
          {loading && <Spinner className="w-4" />}
          <p className="text-gray-500 text-sm">
            {formattedCurrentTime} / {formattedDuration}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Control buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost-primary"
            className="w-12 h-12 flex items-center justify-center rounded-2xl [&_svg]:size-5"
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
            className="w-12 h-12 flex items-center justify-center rounded-2xl [&_svg]:size-5"
            disabled={!canPlay}
          >
            {playerStatus === "playing" ? <Pause /> : <PlayArrow />}
          </Button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 relative">
          <div 
            ref={progressRef}
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleProgressClick}
          >
            {/* Buffered progress */}
            <div
              className="absolute top-0 left-0 h-full bg-gray-300 rounded-full transition-all duration-200"
              style={{ width: `${bufferedPercentage}%` }}
            />
            {/* Current progress */}
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Loading indicator for streaming */}
          {loading && canPlay && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <VolumeUp className="w-3 h-3" />
                <span>Streaming...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buffer status indicator */}
      {canPlay && bufferedPercentage < 100 && (
        <div className="text-xs text-gray-400 text-center">
          Buffered: {Math.round(bufferedPercentage)}%
        </div>
      )}
    </div>
  );
};

export default StreamingSoundPlayer;