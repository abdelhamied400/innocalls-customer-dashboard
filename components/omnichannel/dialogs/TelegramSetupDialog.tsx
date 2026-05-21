"use client";

import { useState } from "react";
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
  Check,
  LinkOff,
  OpenInNew,
  Save,
  Warning,
} from "@mui/icons-material";
import ChannelIcon, { channelLabels } from "../ChannelIcon";
import { cn } from "@/lib/utils";

type Props = {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

/**
 * Single-screen setup dialog for Telegram — mirrors the OAuth dialog
 * style. Telegram is technically a manual flow (user pastes a Bot Token
 * from BotFather), but the UX is the same shape as the OAuth ones once
 * you collapse the wizard chrome:
 *
 *  • Hero header with channel-branded gradient + icon
 *  • Body: helper link to BotFather + two credential fields
 *  • Footer: Cancel + Save / Disconnect + Done
 *
 * Existing-channel mode shows a connected confirmation rather than the
 * form — matching the OAuth dialog's "to change, disconnect and reconnect"
 * pattern. Keeps the UX consistent across channels.
 */
const TelegramSetupDialog = ({
  channel,
  open,
  onOpenChange,
  onSaved,
}: Props) => {
  const t = useTranslations("omnichannel.channels");

  const [botToken, setBotToken] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedChannel, setSavedChannel] = useState<Channel | null>(null);

  const reset = () => {
    setBotToken("");
    setBotUsername("");
    setErrors({});
    setGeneralError(null);
    setSavedChannel(null);
    setIsSaving(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  if (!channel) return null;

  const isExisting = channel.status !== "disconnected";
  const isSuccess = !!savedChannel;
  const cfg = (savedChannel?.config ?? channel.config ?? {}) as Record<
    string,
    unknown
  >;
  const connectedUsername = cfg.botUsername as string | undefined;

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});
    setGeneralError(null);
    try {
      const result = await omnichannelService.createChannel({
        type: "telegram",
        name: channel.name,
        description: channel.description ?? undefined,
        config: { botToken, botUsername },
      });
      setSavedChannel(result);
      onSaved?.();
    } catch (err: any) {
      const response = err?.response;
      if (response?.status === 400 && response?.data?.errors) {
        setErrors(response.data.errors);
      } else {
        setGeneralError(response?.data?.error || t("saveError"));
      }
    }
    setIsSaving(false);
  };

  const handleDisconnect = async () => {
    const ok = window.confirm(
      `Disconnect ${channelLabels.telegram}? You can reconnect any time.`,
    );
    if (!ok) return;
    try {
      await omnichannelService.deleteChannel(channel.id);
      onSaved?.();
      handleClose();
    } catch {
      /* swallow */
    }
  };

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full h-10 px-3 bg-white border rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all",
      hasError ? "border-red-300 bg-red-50/40" : "border-gray-200",
    );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Hero header — sky gradient matches the Telegram brand color
            used on the channels page card. */}
        <DialogHeader className="px-6 pt-6 pb-5 bg-gradient-to-br from-sky-50 via-sky-50/40 to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ring-4 ring-sky-100 bg-white">
              <ChannelIcon channel="telegram" className="!text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-[15px] font-semibold text-gray-900">
                {isExisting
                  ? t("configureTitle", { channel: channelLabels.telegram })
                  : t("connectTitle", { channel: channelLabels.telegram })}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-0.5">
                {isExisting && connectedUsername
                  ? `@${connectedUsername}`
                  : "Connect a Telegram bot you created via BotFather."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Existing-channel mode — same confirmation block as OAuth */}
          {isExisting && !isSuccess && (
            <div className="flex items-start gap-3 text-xs text-gray-600 bg-green-50/60 border border-green-100 rounded-lg p-3">
              <CheckCircle className="!text-base text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-[13px]">
                  Bot is connected
                </p>
                <p className="text-gray-500 mt-0.5">
                  Messages are flowing automatically. To rotate the bot token
                  or swap bots, disconnect below and reconnect with the new
                  credentials.
                </p>
              </div>
            </div>
          )}

          {/* Success state — fresh connect */}
          {isSuccess && (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center ring-4 ring-green-100">
                <CheckCircle className="!text-3xl text-green-500" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("channelConnected")}
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  {connectedUsername
                    ? `Your bot @${connectedUsername} is now connected and ready to receive messages.`
                    : t("oauthSuccess", { channel: channelLabels.telegram })}
                </p>
              </div>
            </div>
          )}

          {/* New-channel mode — BotFather quicklink + credential fields */}
          {!isExisting && !isSuccess && (
            <>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg bg-sky-50/60 border border-sky-100 hover:bg-sky-100/60 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 ring-1 ring-sky-100">
                  <ChannelIcon channel="telegram" className="!text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                    Don't have a bot yet?
                    <OpenInNew className="!text-[12px] text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    Open @BotFather in Telegram, send /newbot, and copy the
                    token + username it gives you.
                  </p>
                </div>
              </a>

              {generalError && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
                  <Warning className="!text-sm text-red-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-red-600">{generalError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    Bot Token
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={botToken}
                    onChange={(e) => {
                      setBotToken(e.target.value);
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.botToken;
                        return next;
                      });
                    }}
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v..."
                    className={inputClass(!!errors.botToken)}
                  />
                  {errors.botToken && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.botToken}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    Bot Username
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={botUsername}
                    onChange={(e) => {
                      setBotUsername(e.target.value);
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.botUsername;
                        return next;
                      });
                    }}
                    placeholder="e.g. mycompany_support_bot"
                    className={inputClass(!!errors.botUsername)}
                  />
                  {errors.botUsername && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.botUsername}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          {isSuccess ? (
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
              >
                <LinkOff className="!text-sm" />
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
              <Button
                variant="ghost"
                size="sm"
                className="text-xs rounded-lg text-gray-500"
                onClick={handleClose}
                disabled={isSaving}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-lg shadow-sm"
                onClick={handleSave}
                disabled={
                  isSaving || !botToken.trim() || !botUsername.trim()
                }
              >
                {isSaving ? (
                  <span className="animate-pulse">{t("saving")}</span>
                ) : (
                  <>
                    <Save className="!text-sm" />
                    {t("saveAndConnect")}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TelegramSetupDialog;
