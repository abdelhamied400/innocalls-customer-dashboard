import { useEffect, useRef, useState } from "react";
import {
  Send,
  Mic,
  Close,
  MicOff,
  AttachFile,
  Description,
  Image as ImageIcon,
  Movie,
  Reply,
} from "@mui/icons-material";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import { RecordingWaveform } from "@innocalls/chat-ui";
import type { Message } from "@/types/omnichannel";

type MediaKind = "image" | "video" | "document";

type ChatInputProps = {
  onSendMessage: (content: string) => void;
  onSendVoice: (blob: Blob, duration: number) => void;
  onSendMedia?: (file: File, kind: MediaKind, caption?: string) => void;
  /** Currently-pending reply target. When non-null, the input shows a
   * dismissible quoted preview above the row and the next send carries
   * `replyToMessageId`. */
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  disabled?: boolean;
};

/** Same compact preview used in MessageBubble's quote chip. */
function quotePreview(m: Message): string {
  switch (m.type) {
    case "voice":
      return "🎵 Voice message";
    case "image":
      return m.content || "📷 Image";
    case "sticker":
      return "🪄 Sticker";
    case "video":
      return m.content || "🎬 Video";
    case "document":
      return m.content || "📎 Document";
    default: {
      const text = m.content?.replace(/\s+/g, " ").trim() ?? "";
      return text.length > 80 ? `${text.slice(0, 80)}…` : text;
    }
  }
}

/**
 * Pick the WhatsApp media kind for a given file based on its MIME type.
 * Anything not image/video falls back to "document" so PDFs, zips,
 * spreadsheets, etc. all go through the document upload path.
 */
function classifyFile(file: File): MediaKind {
  const mime = (file.type || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "document";
}

const ChatInput = ({
  onSendMessage,
  onSendVoice,
  onSendMedia,
  replyingTo,
  onCancelReply,
  disabled,
}: ChatInputProps) => {
  const t = useTranslations("omnichannel");
  const [messageInput, setMessageInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Staged attachment: when set, the input row turns into a preview/caption
  // area until the agent hits send (or cancels).
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingKind, setPendingKind] = useState<MediaKind>("document");
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
    null,
  );
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a blob preview for staged image/video; clean up on unstage.
  useEffect(() => {
    if (!pendingFile) {
      setPendingPreviewUrl(null);
      return;
    }
    if (pendingKind === "image" || pendingKind === "video") {
      const url = URL.createObjectURL(pendingFile);
      setPendingPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPendingPreviewUrl(null);
  }, [pendingFile, pendingKind]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    onSendMessage(messageInput.trim());
    setMessageInput("");
  };

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so the same file can be picked again
    if (!file) return;
    setPendingFile(file);
    setPendingKind(classifyFile(file));
    setCaption("");
  };

  const cancelPending = () => {
    setPendingFile(null);
    setCaption("");
  };

  const sendPending = () => {
    if (!pendingFile || !onSendMedia) return;
    onSendMedia(pendingFile, pendingKind, caption.trim() || undefined);
    setPendingFile(null);
    setCaption("");
  };

  const startRecording = async () => {
    setMicError(null);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = newStream;
      setStream(newStream);

      const recorder = new MediaRecorder(newStream);
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
    setStream(null);
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
            <RecordingWaveform stream={stream} />
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

  // Attachment-staged state: replace the normal input row with a preview +
  // caption + send/cancel. Visually distinct so it's clear what'll go out.
  if (pendingFile) {
    const KindIcon =
      pendingKind === "image"
        ? ImageIcon
        : pendingKind === "video"
          ? Movie
          : Description;

    return (
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
          {/* Preview */}
          <div className="shrink-0">
            {pendingKind === "image" && pendingPreviewUrl ? (
              <img
                src={pendingPreviewUrl}
                alt="preview"
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : pendingKind === "video" && pendingPreviewUrl ? (
              <video
                src={pendingPreviewUrl}
                className="w-16 h-16 rounded-lg object-cover bg-black"
                muted
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <KindIcon className="!text-2xl text-gray-400" />
              </div>
            )}
          </div>

          {/* Filename + caption input */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <KindIcon className="!text-sm text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600 truncate">
                {pendingFile.name}
              </span>
              <span className="text-[10px] text-gray-400 shrink-0">
                ({Math.round(pendingFile.size / 1024)} KB)
              </span>
            </div>
            {pendingKind !== "document" && (
              <input
                type="text"
                placeholder="Add a caption…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendPending()}
                className="w-full h-8 px-3 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-300 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={cancelPending}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
            >
              <Close className="!text-base" />
            </button>
            <button
              onClick={sendPending}
              disabled={disabled}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                disabled
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-primary-500 text-white hover:bg-primary-600 shadow-sm active:scale-95",
              )}
            >
              <Send className="!text-[13px]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-white">
      {replyingTo && (
        <div className="flex items-start gap-2 mb-2 px-3 py-2 bg-gray-50 border-l-4 border-primary-300 rounded-r-lg">
          <Reply className="!text-base text-primary-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-primary-500">
              Replying to {replyingTo.senderName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {quotePreview(replyingTo)}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            aria-label="Cancel reply"
            className="text-gray-300 hover:text-red-500 shrink-0"
          >
            <Close className="!text-base" />
          </button>
        </div>
      )}
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
        {onSendMedia && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={onFilePicked}
              accept="image/jpeg,image/png,video/mp4,video/3gpp,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0",
                disabled
                  ? "text-gray-200 cursor-not-allowed"
                  : "text-gray-400 hover:text-primary-500 hover:bg-primary-50 active:scale-95",
              )}
              title="Attach file"
            >
              <AttachFile className="text-xl!" />
            </button>
          </>
        )}
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
