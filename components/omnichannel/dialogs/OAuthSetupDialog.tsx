"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Channel, ChannelType } from "@/types/omnichannel";
import { useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Check,
  ErrorOutline,
  HourglassEmpty,
  Login,
  LinkOff,
} from "@mui/icons-material";
import ChannelIcon, { channelLabels } from "../ChannelIcon";
import { cn } from "@/lib/utils";

type Props = {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

type OAuthState = "idle" | "waiting" | "success" | "error";

/** Brand tints per OAuth channel — matches the connected-channel cards
 * on the settings page so the dialog feels owned by the channel. */
const channelHero: Record<
  ChannelType,
  { bg: string; ring: string }
> = {
  whatsapp: { bg: "from-green-50 via-green-50/40 to-white", ring: "ring-green-100" },
  live_chat: { bg: "from-purple-50 via-purple-50/40 to-white", ring: "ring-purple-100" }, // unused — live_chat is manual
  messenger: { bg: "from-blue-50 via-blue-50/40 to-white", ring: "ring-blue-100" },
  x: { bg: "from-gray-100 via-gray-50 to-white", ring: "ring-gray-200" },
  instagram: { bg: "from-pink-50 via-pink-50/40 to-white", ring: "ring-pink-100" },
  telegram: { bg: "from-sky-50 via-sky-50/40 to-white", ring: "ring-sky-100" }, // unused — telegram is manual
};

/** Pull a human-readable account identifier off a connected OAuth
 * channel — "@handle" for X/Instagram, page name for Messenger, phone for
 * WhatsApp. */
function getConnectedAccountLabel(channel: Channel): string | null {
  const cfg = (channel.config ?? {}) as Record<string, unknown>;
  switch (channel.type) {
    case "x": {
      const u = cfg.username as string | undefined;
      return u ? `@${u}` : null;
    }
    case "instagram": {
      const u = cfg.username as string | undefined;
      return u ? `@${u}` : null;
    }
    case "messenger":
    case "whatsapp":
      return channel.name || null;
    default:
      return null;
  }
}

/**
 * Single-screen setup dialog for OAuth channels (WhatsApp, Messenger,
 * Instagram, X). Replaces the multi-step wizard chrome — the entire flow
 * is "click button → wait → done", so a wizard feels invented.
 *
 * Existing-channel mode shows the identity + Meta webhook credentials
 * (URL + verify token) for re-pasting into the Meta App Dashboard.
 */
const OAuthSetupDialog = ({ channel, open, onOpenChange, onSaved }: Props) => {
  const t = useTranslations("omnichannel.channels");

  const [oauthState, setOauthState] = useState<OAuthState>("idle");
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [savedChannel, setSavedChannel] = useState<Channel | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageHandlerRef = useRef<((e: MessageEvent) => void) | null>(null);

  const cleanup = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (messageHandlerRef.current) {
      window.removeEventListener("message", messageHandlerRef.current);
      messageHandlerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setOauthState("idle");
    setOauthError(null);
    setSavedChannel(null);
  }, [cleanup]);

  useEffect(() => () => cleanup(), [cleanup]);

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  const startOAuth = async () => {
    if (!channel) return;
    setOauthState("waiting");
    setOauthError(null);

    let url: string;
    let state: string;
    try {
      const res = await omnichannelService.getOAuthUrl(channel.type);
      url = res.url;
      state = res.state;
    } catch {
      setOauthState("error");
      setOauthError(t("oauthError"));
      return;
    }

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      `${channel.type}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`,
    );

    if (!popup) {
      setOauthState("error");
      setOauthError(t("oauthError"));
      return;
    }

    const finishSuccess = (ch: Channel | null) => {
      cleanup();
      setSavedChannel(ch);
      setOauthState("success");
      onSaved?.();
    };
    const finishError = (msg: string) => {
      cleanup();
      setOauthError(msg);
      setOauthState("error");
    };

    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== "omnichannel_oauth_complete") return;
      if (e.data.success) {
        finishSuccess((e.data.channel ?? null) as Channel | null);
      } else {
        finishError(e.data.error || t("oauthError"));
      }
    };
    messageHandlerRef.current = onMessage;
    window.addEventListener("message", onMessage);

    pollRef.current = setInterval(async () => {
      if (popup.closed) {
        try {
          const result = await omnichannelService.getOAuthStatus(state);
          if (result.status === "completed") {
            finishSuccess((result.channel ?? null) as Channel | null);
          } else if (result.status === "failed") {
            finishError(result.error || t("oauthError"));
          } else {
            cleanup();
            setOauthState("idle");
          }
        } catch {
          cleanup();
          setOauthState("idle");
        }
        return;
      }

      try {
        const result = await omnichannelService.getOAuthStatus(state);
        if (result.status === "completed") {
          popup.close();
          finishSuccess((result.channel ?? null) as Channel | null);
        } else if (result.status === "failed") {
          popup.close();
          finishError(result.error || t("oauthError"));
        }
      } catch {
        /* keep polling */
      }
    }, 3000);
  };

  if (!channel) return null;
  const hero = channelHero[channel.type];
  const isExisting = channel.status !== "disconnected";

  const accountLabel = getConnectedAccountLabel(savedChannel ?? channel);

  const handleDisconnect = async () => {
    const ok = window.confirm(
      `Disconnect ${channelLabels[channel.type]}? You can reconnect any time.`,
    );
    if (!ok) return;
    setIsDisconnecting(true);
    try {
      await omnichannelService.deleteChannel(channel.id);
      onSaved?.();
      handleClose();
    } catch {
      /* swallow — error toast is the parent's job */
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Hero header */}
        <DialogHeader
          className={cn(
            "px-6 pt-6 pb-5 bg-gradient-to-br border-b border-gray-100",
            hero.bg,
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ring-4 bg-white",
                hero.ring,
              )}
            >
              <ChannelIcon channel={channel.type} className="!text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-[15px] font-semibold text-gray-900">
                {isExisting
                  ? t("configureTitle", {
                      channel: channelLabels[channel.type],
                    })
                  : t("connectTitle", {
                      channel: channelLabels[channel.type],
                    })}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-0.5">
                {isExisting && accountLabel
                  ? accountLabel
                  : t("oauthHint")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Existing-channel mode — there's nothing for the user to
              configure on an OAuth channel. Webhooks are wired up
              server-to-server during the OAuth callback, so we don't
              expose the webhook URL / verify token here. */}
          {isExisting && oauthState !== "success" && (
            <div className="flex items-start gap-3 text-xs text-gray-600 bg-green-50/60 border border-green-100 rounded-lg p-3">
              <CheckCircle className="!text-base text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-[13px]">
                  Channel is connected
                </p>
                <p className="text-gray-500 mt-0.5">
                  Messages are flowing automatically. To stop receiving
                  messages, disconnect below.
                </p>
              </div>
            </div>
          )}

          {/* New-channel mode: connect button + states */}
          {!isExisting && oauthState === "idle" && (
            <div className="flex flex-col items-center gap-3 py-2">
              <Button
                size="lg"
                className="gap-2 rounded-xl px-8 shadow-sm"
                onClick={startOAuth}
              >
                <Login className="!text-lg" />
                {t("connectWith", { channel: channelLabels[channel.type] })}
              </Button>
            </div>
          )}

          {!isExisting && oauthState === "waiting" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center ring-4 ring-primary-100">
                <HourglassEmpty className="!text-3xl text-primary-500 animate-pulse" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("oauthWaiting")}
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  {t("oauthWaitingHint")}
                </p>
              </div>
            </div>
          )}

          {oauthState === "success" && (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center ring-4 ring-green-100">
                <CheckCircle className="!text-3xl text-green-500" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("channelConnected")}
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  {accountLabel
                    ? `${t("oauthSuccess", { channel: channelLabels[channel.type] })} ${accountLabel}`
                    : t("oauthSuccess", { channel: channelLabels[channel.type] })}
                </p>
              </div>
            </div>
          )}

          {!isExisting && oauthState === "error" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center ring-4 ring-red-100">
                <ErrorOutline className="!text-3xl text-red-400" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("oauthFailed")}
                </h4>
                <p className="text-xs text-red-500 mt-1 max-w-sm">
                  {oauthError ?? t("oauthError")}
                </p>
              </div>
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-lg"
                onClick={() => {
                  setOauthError(null);
                  setOauthState("idle");
                }}
              >
                {t("tryAgain")}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          {oauthState === "success" ? (
            <>
              <div />
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-lg"
                onClick={handleClose}
              >
                <Check className="!text-sm" />
                {t("done")}
              </Button>
            </>
          ) : isExisting ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs rounded-lg text-destructive-500 hover:text-destructive-600 hover:bg-red-50"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-destructive-300 border-t-destructive-600 animate-spin" />
                ) : (
                  <LinkOff className="!text-sm" />
                )}
                {t("disconnect")}
              </Button>
              <Button
                size="sm"
                className="text-xs rounded-lg"
                onClick={handleClose}
              >
                {t("done")}
              </Button>
            </>
          ) : (
            <>
              <div />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs rounded-lg text-gray-500"
                onClick={handleClose}
              >
                {t("cancel") || "Cancel"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OAuthSetupDialog;
