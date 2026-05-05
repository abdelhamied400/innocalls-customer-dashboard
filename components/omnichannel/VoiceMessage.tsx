"use client";

import { cn } from "@/lib/utils";
import { PlayArrow, Pause } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import omnichannelService from "@/services/omnichannel.service";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

type VoiceMessageProps = {
  conversationId: string;
  messageId: string;
  duration: number;
  isOutbound: boolean;
};

const formatDuration = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

const VoiceMessage = ({
  conversationId,
  messageId,
  duration,
  isOutbound,
}: VoiceMessageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [errored, setErrored] = useState(false);

  // Lazy-load: hold off on the audio fetch + wavesurfer init until the
  // bubble scrolls into view. Without this, opening a conversation with N
  // voice notes triggers N audio downloads + waveform decodes in parallel.
  const { targetRef, isIntersecting } = useIntersectionObserver({
    rootMargin: "200px",
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (!isIntersecting) return;
    if (!containerRef.current) return;
    let ws: any = null;
    let cancelled = false;

    (async () => {
      try {
        const blobUrl = await omnichannelService.fetchVoiceMessageBlobUrl(
          conversationId,
          messageId,
        );
        if (cancelled) {
          URL.revokeObjectURL(blobUrl);
          return;
        }
        blobUrlRef.current = blobUrl;

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
        ws.load(blobUrl);
      } catch {
        if (!cancelled) setErrored(true);
      }
    })();

    return () => {
      cancelled = true;
      try {
        ws?.destroy();
      } catch {
        // already destroyed
      }
      wavesurferRef.current = null;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [conversationId, messageId, isOutbound, isIntersecting]);

  const handleToggle = () => {
    wavesurferRef.current?.playPause();
  };

  const displayTime = isPlaying || currentTime > 0 ? currentTime : duration;

  return (
    <div ref={targetRef} className="flex items-center gap-2.5 min-w-50">
      <button
        onClick={handleToggle}
        disabled={!isReady || errored}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
          isOutbound
            ? "bg-white/20 hover:bg-white/30"
            : "bg-primary-100 text-primary-600 hover:bg-primary-200",
          (!isReady || errored) && "opacity-50",
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
        {errored ? "—" : formatDuration(Math.round(displayTime))}
      </span>
    </div>
  );
};

export default VoiceMessage;
