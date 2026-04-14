import { useRef, useState } from "react";
import { Send, Mic, Close, MicOff } from "@mui/icons-material";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import RecordingWaveform from "./RecordingWaveform";

type ChatInputProps = {
  onSendMessage: (content: string) => void;
  onSendVoice: (blob: Blob, duration: number) => void;
  disabled?: boolean;
};

const ChatInput = ({
  onSendMessage,
  onSendVoice,
  disabled,
}: ChatInputProps) => {
  const t = useTranslations("omnichannel");
  const [messageInput, setMessageInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    onSendMessage(messageInput.trim());
    setMessageInput("");
  };

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      if (err?.name === "NotAllowedError") {
        setMicError(t("micPermissionDenied"));
      } else if (err?.name === "NotFoundError") {
        setMicError(t("micNotFound"));
      } else {
        setMicError(t("micError"));
      }
    }
  };

  const stopMediaTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopAndSend = () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      stopMediaTracks();
      setIsRecording(false);
      setRecordingTime(0);
      return;
    }

    const duration = recordingTime;

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      chunksRef.current = [];
      recorderRef.current = null;

      if (duration > 0) {
        onSendVoice(blob, duration);
      }
    };

    recorder.stop();
    stopMediaTracks();
    setIsRecording(false);
    setRecordingTime(0);
  };

  const cancelRecording = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }
    chunksRef.current = [];
    recorderRef.current = null;
    stopMediaTracks();
    setIsRecording(false);
    setRecordingTime(0);
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  if (isRecording) {
    return (
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 bg-red-50 rounded-xl px-4 py-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-sm font-medium text-red-600">
            {t("recording")}
          </span>
          <span className="text-sm text-red-400 font-mono tabular-nums">
            {formatTime(recordingTime)}
          </span>
          {/* Live waveform from mic */}
          <div className="flex-1 mx-2">
            <RecordingWaveform stream={streamRef.current} />
          </div>
          <button
            onClick={cancelRecording}
            className="w-9 h-9 rounded-full bg-white border border-red-200 flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-300 transition-colors shrink-0"
          >
            <Close className="text-lg!" />
          </button>
          <button
            onClick={stopAndSend}
            className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors shadow-sm shrink-0"
          >
            <Send className="text-[15px]!" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-white">
      {micError && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
          <MicOff className="text-sm! text-red-400 shrink-0" />
          <span className="text-xs text-red-600 flex-1">{micError}</span>
          <button
            onClick={() => setMicError(null)}
            className="text-red-300 hover:text-red-500 shrink-0"
          >
            <Close className="text-sm!" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={startRecording}
          disabled={disabled}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0",
            disabled
              ? "text-gray-200 cursor-not-allowed"
              : "text-gray-400 hover:text-primary-500 hover:bg-primary-50 active:scale-95",
          )}
        >
          <Mic className="text-xl!" />
        </button>
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder={t("messageInput.placeholder")}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={disabled}
            className={cn(
              "w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm placeholder:text-gray-300",
              "focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!messageInput.trim() || disabled}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0",
            messageInput.trim() && !disabled
              ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm active:scale-95"
              : "bg-gray-100 text-gray-300 cursor-not-allowed",
          )}
        >
          <Send className="text-[15px]!" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
