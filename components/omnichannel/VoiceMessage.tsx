"use client";

import { cn } from "@/lib/utils";
import { PlayArrow, Pause } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";

type VoiceMessageProps = {
  duration: number;
  isOutbound: boolean;
};

/**
 * Generate a mock WAV audio blob with noise so wavesurfer renders a waveform.
 */
function generateMockAudio(durationSec: number): Blob {
  const sampleRate = 8000;
  const numSamples = sampleRate * Math.min(durationSec, 30);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, numSamples * 2, true);

  let seed = durationSec * 1000 + 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed / 2147483647) * 2 - 1;
  };

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const envelope =
      Math.sin(t * Math.PI) *
      (0.3 + 0.7 * Math.abs(Math.sin(t * Math.PI * 6)));
    const sample = rand() * envelope * 16000;
    view.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, sample)), true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

const formatDuration = (s: number) => {
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

const VoiceMessage = ({ duration, isOutbound }: VoiceMessageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const audioBlob = useMemo(() => generateMockAudio(duration), [duration]);

  useEffect(() => {
    if (!containerRef.current) return;

    let ws: any = null;
    let cancelled = false;

    (async () => {
      const WaveSurfer = (await import("wavesurfer.js")).default;
      if (cancelled || !containerRef.current) return;

      ws = WaveSurfer.create({
        container: containerRef.current,
        height: 28,
        barWidth: 2.5,
        barGap: 1.5,
        barRadius: 4,
        waveColor: isOutbound ? "rgba(255,255,255,0.35)" : "#d1d5db",
        progressColor: isOutbound ? "#ffffff" : "#1b78b3",
        cursorWidth: 0,
        normalize: true,
        interact: true,
        dragToSeek: true,
        hideScrollbar: true,
        fillParent: true,
      });

      ws.on("ready", () => {
        if (!cancelled) setIsReady(true);
      });
      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      ws.on("timeupdate", (time: number) => setCurrentTime(time));

      wavesurferRef.current = ws;

      // Load blob directly
      ws.loadBlob(audioBlob);
    })();

    return () => {
      cancelled = true;
      try {
        ws?.destroy();
      } catch {
        // already destroyed
      }
      wavesurferRef.current = null;
    };
  }, [audioBlob, isOutbound]);

  const handleToggle = () => {
    wavesurferRef.current?.playPause();
  };

  const displayTime = isPlaying || currentTime > 0 ? currentTime : duration;

  return (
    <div className="flex items-center gap-2.5 min-w-50">
      <button
        onClick={handleToggle}
        disabled={!isReady}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
          isOutbound
            ? "bg-white/20 hover:bg-white/30"
            : "bg-primary-100 text-primary-600 hover:bg-primary-200",
          !isReady && "opacity-50",
        )}
      >
        {isPlaying ? (
          <Pause className="text-[16px]!" />
        ) : (
          <PlayArrow className="text-[16px]!" />
        )}
      </button>
      <div ref={containerRef} className="flex-1 min-w-0" />
      <span
        className={cn(
          "text-[10px] font-mono tabular-nums shrink-0",
          isOutbound ? "text-white/60" : "text-gray-400",
        )}
      >
        {formatDuration(Math.round(displayTime))}
      </span>
    </div>
  );
};

export default VoiceMessage;
