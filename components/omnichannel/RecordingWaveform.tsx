"use client";

import { useEffect, useRef } from "react";

type RecordingWaveformProps = {
  /** The live mic MediaStream to visualize */
  stream: MediaStream | null;
};

const RecordingWaveform = ({ stream }: RecordingWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const barWidth = 2.5;
    const barGap = 1.5;
    const totalBarWidth = barWidth + barGap;
    const barCount = Math.floor(rect.width / totalBarWidth);
    const maxHeight = rect.height;

    // Draw flat line (idle state)
    const drawIdle = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (let i = 0; i < barCount; i++) {
        const x = i * totalBarWidth;
        ctx.fillStyle = "#fca5a5";
        ctx.beginPath();
        ctx.roundRect(x, maxHeight / 2 - 1, barWidth, 2, 1);
        ctx.fill();
      }
    };

    if (!stream) {
      drawIdle();
      return;
    }

    // Set up Web Audio analyser from the mic stream
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.7;
    source.connect(analyser);

    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < barCount; i++) {
        const x = i * totalBarWidth;
        // Map bar index to a frequency bin range
        const binIndex = Math.floor((i / barCount) * dataArray.length);
        const value = dataArray[binIndex] / 255;
        const barHeight = Math.max(2, value * maxHeight * 0.9);
        const y = (maxHeight - barHeight) / 2;

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1.5);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      source.disconnect();
      if (audioCtx.state !== "closed") {
        audioCtx.close();
      }
      audioCtxRef.current = null;
      analyserRef.current = null;
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-7"
      style={{ display: "block" }}
    />
  );
};

export default RecordingWaveform;
