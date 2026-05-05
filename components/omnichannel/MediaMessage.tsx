"use client";

import { useEffect, useState } from "react";
import omnichannelService from "@/services/omnichannel.service";
import { Description, Download } from "@mui/icons-material";
import { cn } from "@/lib/utils";
import type { MessageType } from "@/types/omnichannel";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

type MediaType = Extract<
  MessageType,
  "image" | "sticker" | "video" | "document"
>;

type Props = {
  conversationId: string;
  messageId: string;
  type: MediaType;
  /** The preview label set by the API (e.g. "📷 Image", "📎 invoice.pdf"). */
  content: string;
  isOutbound: boolean;
};

const MediaMessage = ({
  conversationId,
  messageId,
  type,
  content,
  isOutbound,
}: Props) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Lazy-load: only fetch the blob once the bubble scrolls into view (or
  // within 200px of it). Without this, opening a conversation with N
  // attachments would fire N parallel media GETs and stall the inbox.
  // `freezeOnceVisible` keeps the loaded state sticky so scrolling away
  // and back doesn't re-fetch.
  const { targetRef, isIntersecting } = useIntersectionObserver({
    rootMargin: "200px",
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (!isIntersecting) return;
    let revokeUrl: string | null = null;
    let cancelled = false;

    omnichannelService
      .fetchMessageMediaBlobUrl(conversationId, messageId)
      .then(({ url: blobUrl }) => {
        if (cancelled) {
          URL.revokeObjectURL(blobUrl);
          return;
        }
        revokeUrl = blobUrl;
        setUrl(blobUrl);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [conversationId, messageId, isIntersecting]);

  if (error) {
    return (
      <div ref={targetRef}>
        <p className="text-[13px] italic opacity-60">
          {content} (unavailable)
        </p>
      </div>
    );
  }

  // Loading skeletons sized to match the eventual rendered media so the
  // bubble doesn't jump when the blob arrives. The wrapping div carries
  // the IntersectionObserver target ref — it's the placeholder Meta sees
  // before the blob fetch fires.
  if (!url) {
    if (type === "image") {
      return (
        <div
          ref={targetRef}
          className="w-[280px] h-[200px] rounded-md bg-gray-200/70 animate-pulse"
        />
      );
    }
    if (type === "sticker") {
      return (
        <div
          ref={targetRef}
          className="w-32 h-32 rounded-md bg-gray-200/40 animate-pulse"
        />
      );
    }
    if (type === "video") {
      return (
        <div
          ref={targetRef}
          className="w-[280px] h-[180px] rounded-md bg-gray-200/70 animate-pulse"
        />
      );
    }
    // document — short pill-shaped skeleton matching the file-card layout
    return (
      <div
        ref={targetRef}
        className={cn(
          "h-8 w-44 rounded-md animate-pulse",
          isOutbound ? "bg-white/15" : "bg-gray-200/70",
        )}
      />
    );
  }

  if (type === "image") {
    return (
      <div ref={targetRef}>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block"
        >
          <img
            src={url}
            alt={content}
            className="max-w-[280px] max-h-[400px] rounded-md cursor-zoom-in object-cover"
          />
        </button>
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
            onClick={() => setLightboxOpen(false)}
          >
            <img
              src={url}
              alt={content}
              className="max-w-[95vw] max-h-[95vh] object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  if (type === "sticker") {
    return (
      <div ref={targetRef}>
        <img
          src={url}
          alt={content}
          className="w-32 h-32 object-contain"
        />
      </div>
    );
  }

  if (type === "video") {
    return (
      <div ref={targetRef}>
        <video
          src={url}
          controls
          className="max-w-[280px] max-h-[400px] rounded-md"
        />
      </div>
    );
  }

  // document
  const filename = content.replace(/^📎\s*/, "") || "document";
  return (
    <div ref={targetRef}>
      <a
        href={url}
        download={filename}
        className={cn(
          "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] no-underline",
          isOutbound
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-gray-50 text-gray-800 hover:bg-gray-100",
        )}
      >
        <Description className="!text-base shrink-0" />
        <span className="truncate max-w-[180px]">{filename}</span>
        <Download className="!text-base shrink-0 opacity-70" />
      </a>
    </div>
  );
};

export default MediaMessage;
