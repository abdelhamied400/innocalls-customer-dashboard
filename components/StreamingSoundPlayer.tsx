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
  const [playerStatus, setPlayerStatus] = useState<"playing" | "paused">(
    "paused"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);
  const formattedCurrentTime = useMemo(
    () => formatDuration(currentTime),
    [currentTime]
  );
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration ? (buffered / duration) * 100 : 0;

  // Generate waveform from audio data
  const generateWaveform = async (audioUrl: string) => {
    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const rawData = audioBuffer.getChannelData(0); // Get first channel
      const samples = 100; // Number of bars in waveform
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];

      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }

      // Normalize the data
      const multiplier = Math.pow(Math.max(...filteredData), -1);
      const normalizedData = filteredData.map((n) => n * multiplier);

      setWaveformData(normalizedData);
    } catch (error) {
      console.error("Error generating waveform:", error);
      // Fallback to simple bars if waveform generation fails
      setWaveformData(
        Array.from({ length: 100 }, () => Math.random() * 0.7 + 0.3)
      );
    }
  };

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
      // Generate waveform after metadata is loaded
      generateWaveform(url);
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
      <audio ref={audioRef} src={url} preload="metadata" className="hidden" />

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

        {/* Waveform Progress bar */}
        <div className="flex-1 relative">
          <div
            ref={progressRef}
            className="w-full h-12 cursor-pointer relative flex items-center gap-[1px] overflow-hidden"
            onClick={handleProgressClick}
          >
            {/* Render actual waveform bars */}
            {waveformData.length > 0
              ? waveformData.map((amplitude, i) => {
                  const barProgress = (i / waveformData.length) * 100;

                  // Determine bar color based on progress
                  let barColor = "#E5E7EB"; // Gray - unplayed
                  if (barProgress <= bufferedPercentage) {
                    barColor = "#D1D5DB"; // Light gray - buffered
                  }
                  if (barProgress <= progressPercentage) {
                    barColor = "#3B82F6"; // Blue - played
                  }

                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-full transition-all duration-100"
                      style={{
                        height: `${Math.max(amplitude * 100, 4)}%`, // Use actual amplitude, minimum 4%
                        backgroundColor: barColor,
                        minWidth: "1px",
                      }}
                    />
                  );
                })
              : // Loading placeholder bars
                Array.from({ length: 100 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gray-200 rounded-full animate-pulse"
                    style={{
                      height: `${30 + Math.sin(i * 0.5) * 20}%`,
                      minWidth: "1px",
                    }}
                  />
                ))}
          </div>

          {/* Loading indicator for streaming */}
          {loading && canPlay && (
            <div className="absolute right-2 top-0">
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
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
