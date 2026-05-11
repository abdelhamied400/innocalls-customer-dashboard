"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Channel } from "@/types/omnichannel";
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
  ErrorOutline,
  HourglassEmpty,
  Login,
} from "@mui/icons-material";
import ChannelIcon, { channelLabels } from "../ChannelIcon";

type Props = {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

type OAuthState = "idle" | "waiting" | "success" | "error";

/**
 * Bespoke setup dialog for X (Twitter). Single screen, single button —
 * no step indicator or wizard chrome. The OAuth 2.0 PKCE flow is fully
 * driven from the API: this component just opens the popup and waits.
 */
const XSetupDialog = ({ channel, open, onOpenChange, onSaved }: Props) => {
  const t = useTranslations("omnichannel.channels");

  const [oauthState, setOauthState] = useState<OAuthState>("idle");
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [savedChannel, setSavedChannel] = useState<Channel | null>(null);

  const popupRef = useRef<Window | null>(null);
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
    setOauthState("waiting");
    setOauthError(null);

    let url: string;
    let state: string;
    try {
      const res = await omnichannelService.getOAuthUrl("x");
      url = res.url;
      state = res.state;
    } catch {
      setOauthState("error");
      setOauthError(t("oauthError"));
      return;
    }

    // Center the popup on the current window.
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      "x_oauth",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`,
    );
    popupRef.current = popup;

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

    // Primary path: the popup HTML postMessages back when the callback finishes.
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

    // Fallback: poll the OAuth state row every 3s in case postMessage is
    // dropped (e.g. cross-origin restrictions on the popup), and detect
    // when the user closes the popup without completing the flow.
    pollRef.current = setInterval(async () => {
      if (popup.closed) {
        try {
          const result = await omnichannelService.getOAuthStatus(state);
          if (result.status === "completed") {
            finishSuccess((result.channel ?? null) as Channel | null);
          } else if (result.status === "failed") {
            finishError(result.error || t("oauthError"));
          } else {
            // Popup closed before completion → treat as user-cancelled, go idle.
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
        // Transient — keep polling.
      }
    }, 3000);
  };

  if (!channel) return null;

  const accountLabel = (savedChannel?.config as { username?: string } | undefined)
    ?.username
    ? `@${(savedChannel!.config as { username?: string }).username}`
    : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <ChannelIcon channel="x" className="!text-2xl" />
            </div>
            <div>
              <DialogTitle className="text-base">
                {t("connectTitle", { channel: channelLabels.x })}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {t("oauthHint")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          {oauthState === "idle" && (
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                className="gap-2 rounded-xl px-8"
                onClick={startOAuth}
              >
                <Login className="!text-lg" />
                {t("connectWith", { channel: channelLabels.x })}
              </Button>
            </div>
          )}

          {oauthState === "waiting" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <HourglassEmpty className="!text-3xl text-primary-400 animate-pulse" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("oauthWaiting")}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {t("oauthWaitingHint")}
                </p>
              </div>
            </div>
          )}

          {oauthState === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="!text-3xl text-green-500" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("channelConnected")}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {accountLabel
                    ? `${t("oauthSuccess", { channel: channelLabels.x })} ${accountLabel}`
                    : t("oauthSuccess", { channel: channelLabels.x })}
                </p>
              </div>
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-lg mt-2"
                onClick={handleClose}
              >
                {t("done")}
              </Button>
            </div>
          )}

          {oauthState === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <ErrorOutline className="!text-3xl text-red-400" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("oauthFailed")}
                </h4>
                <p className="text-xs text-red-500 mt-1">
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
      </DialogContent>
    </Dialog>
  );
};

export default XSetupDialog;
