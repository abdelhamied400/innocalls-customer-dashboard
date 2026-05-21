"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Channel, ChannelType } from "@/types/omnichannel";
import { useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  OpenInNew,
  ArrowBack,
  ArrowForward,
  Save,
  ContentCopy,
  Warning,
  Login,
  HourglassEmpty,
  ErrorOutline,
  Refresh,
  Check,
} from "@mui/icons-material";
import { cn } from "@/lib/utils";
import ChannelIcon, { channelLabels } from "./ChannelIcon";
import {
  channelSetupConfigs,
  type ConfigField,
} from "./channelSetupConfig";

type ChannelSetupDialogProps = {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

/** Channel-specific tints used to brand the dialog header + side rail. */
const channelHero: Record<
  ChannelType,
  { bg: string; iconBg: string; ring: string; accent: string; rail: string; railText: string }
> = {
  whatsapp: {
    bg: "from-green-50 via-green-50/40 to-white",
    iconBg: "bg-white",
    ring: "ring-green-100",
    accent: "bg-green-500",
    rail: "bg-green-50/40",
    railText: "text-green-600",
  },
  live_chat: {
    bg: "from-purple-50 via-purple-50/40 to-white",
    iconBg: "bg-white",
    ring: "ring-purple-100",
    accent: "bg-purple-500",
    rail: "bg-purple-50/40",
    railText: "text-purple-600",
  },
  messenger: {
    bg: "from-blue-50 via-blue-50/40 to-white",
    iconBg: "bg-white",
    ring: "ring-blue-100",
    accent: "bg-blue-500",
    rail: "bg-blue-50/40",
    railText: "text-blue-600",
  },
  x: {
    bg: "from-gray-100 via-gray-50 to-white",
    iconBg: "bg-white",
    ring: "ring-gray-200",
    accent: "bg-gray-900",
    rail: "bg-gray-50",
    railText: "text-gray-900",
  },
  instagram: {
    bg: "from-pink-50 via-pink-50/40 to-white",
    iconBg: "bg-white",
    ring: "ring-pink-100",
    accent: "bg-pink-500",
    rail: "bg-pink-50/40",
    railText: "text-pink-600",
  },
  telegram: {
    bg: "from-sky-50 via-sky-50/40 to-white",
    iconBg: "bg-white",
    ring: "ring-sky-100",
    accent: "bg-sky-500",
    rail: "bg-sky-50/40",
    railText: "text-sky-600",
  },
};

const ChannelSetupDialog = ({
  channel,
  open,
  onOpenChange,
  onSaved,
}: ChannelSetupDialogProps) => {
  const t = useTranslations("omnichannel.channels");
  const [currentStep, setCurrentStep] = useState(0);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});
  const [listInputValues, setListInputValues] = useState<
    Record<string, string>
  >({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedChannel, setSavedChannel] = useState<Channel | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [oauthState, setOauthState] = useState<
    "idle" | "loading" | "waiting" | "polling" | "success" | "error"
  >("idle");
  const [oauthError, setOauthError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const [isRotating, setIsRotating] = useState(false);

  const resetState = useCallback(() => {
    setCurrentStep(0);
    setConfigValues({});
    setFieldErrors({});
    setSavedChannel(null);
    setWarning(null);
    setListInputValues({});
    setOauthState("idle");
    setOauthError(null);
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  if (!channel) return null;

  const config = channelSetupConfigs[channel.type];
  if (!config) return null;

  const { steps, fields, oauth } = config;
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isExistingChannel = channel.status !== "disconnected";
  const hero = channelHero[channel.type];

  const fieldStepIndex = steps.findIndex(
    (s) =>
      s.title.toLowerCase().includes("enter your credentials") ||
      s.title.toLowerCase().includes("customize") ||
      s.title.toLowerCase().includes("configure extensions"),
  );

  const showFieldsOnCurrentStep =
    !oauth &&
    (fieldStepIndex >= 0 ? currentStep === fieldStepIndex : isLastStep);

  const showResult = savedChannel && isLastStep;
  const embedSnippet = savedChannel?.config?.embedSnippet as
    | string
    | undefined;
  const widgetToken = savedChannel?.widgetToken ?? null;

  const sourceConfig = (savedChannel?.config ?? channel.config ?? {}) as Record<
    string,
    unknown
  >;
  const webhookUrl = sourceConfig.webhookUrl as string | undefined;
  const webhookVerifyToken = sourceConfig.webhookVerifyToken as
    | string
    | undefined;

  const existingLiveChatToken =
    isExistingChannel && channel.type === "live_chat" && !savedChannel
      ? (channel.widgetToken ?? null)
      : null;
  const existingLiveChatSnippet = existingLiveChatToken
    ? `<ChatWidget token="${existingLiveChatToken}" />`
    : null;

  const handleRegenerateToken = async () => {
    if (isRotating) return;
    const ok = window.confirm(
      "Regenerate the widget token? The current token will stop working immediately and any deployed widgets must be updated.",
    );
    if (!ok) return;
    setIsRotating(true);
    try {
      const updated = await omnichannelService.regenerateWidgetToken(
        channel.id,
      );
      setSavedChannel(updated);
      onSaved?.();
    } catch (err: any) {
      setWarning(
        err?.response?.data?.error ?? "Failed to regenerate widget token",
      );
    }
    setIsRotating(false);
  };

  // ── OAuth Flow ───────────────────────────────────────────────────────────

  const startOAuth = async () => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      "about:blank",
      `${channel.type}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`,
    );

    if (!popup) {
      setOauthState("error");
      setOauthError(
        "Popup was blocked by your browser. Allow popups for this site and try again.",
      );
      return;
    }

    setOauthState("loading");
    setOauthError(null);

    let url: string;
    let state: string;
    try {
      const res = await omnichannelService.getOAuthUrl(channel.type);
      url = res.url;
      state = res.state;
    } catch {
      popup.close();
      setOauthState("error");
      setOauthError(t("oauthError"));
      return;
    }

    try {
      popup.location.href = url;
      popupRef.current = popup;
      setOauthState("waiting");

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "omnichannel_oauth_complete") {
          window.removeEventListener("message", handleMessage);
          if (pollRef.current) clearInterval(pollRef.current);

          if (event.data.success) {
            setOauthState("success");
            setSavedChannel(event.data.channel ?? null);
            setCurrentStep(totalSteps - 1);
            onSaved?.();
          } else {
            setOauthState("error");
            setOauthError(event.data.error ?? t("oauthError"));
          }
        }
      };
      window.addEventListener("message", handleMessage);

      setOauthState("polling");
      pollRef.current = setInterval(async () => {
        if (popup?.closed) {
          if (pollRef.current) clearInterval(pollRef.current);
          window.removeEventListener("message", handleMessage);

          try {
            const result = await omnichannelService.getOAuthStatus(state);
            if (result.status === "completed") {
              setOauthState("success");
              setSavedChannel(result.channel ?? null);
              setCurrentStep(totalSteps - 1);
              onSaved?.();
            } else if (result.status === "failed") {
              setOauthState("error");
              setOauthError(result.error ?? t("oauthError"));
            } else {
              setOauthState("idle");
            }
          } catch {
            setOauthState("idle");
          }
          return;
        }

        try {
          const result = await omnichannelService.getOAuthStatus(state);
          if (result.status === "completed") {
            if (pollRef.current) clearInterval(pollRef.current);
            window.removeEventListener("message", handleMessage);
            popup?.close();
            setOauthState("success");
            setSavedChannel(result.channel ?? null);
            setCurrentStep(totalSteps - 1);
            onSaved?.();
          } else if (result.status === "failed") {
            if (pollRef.current) clearInterval(pollRef.current);
            window.removeEventListener("message", handleMessage);
            popup?.close();
            setOauthState("error");
            setOauthError(result.error ?? t("oauthError"));
          }
        } catch {
          /* keep polling */
        }
      }, 3000);
    } catch {
      setOauthState("error");
      setOauthError(t("oauthError"));
    }
  };

  // ── Manual Flow ──────────────────────────────────────────────────────────

  const handleFieldChange = (key: string, value: any) => {
    setConfigValues((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleAddListItem = (key: string) => {
    const value = listInputValues[key]?.trim();
    if (!value) return;
    const current = (configValues[key] as string[]) || [];
    if (!current.includes(value)) {
      handleFieldChange(key, [...current, value]);
    }
    setListInputValues((prev) => ({ ...prev, [key]: "" }));
  };

  const handleRemoveListItem = (key: string, index: number) => {
    const current = (configValues[key] as string[]) || [];
    handleFieldChange(
      key,
      current.filter((_, i) => i !== index),
    );
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFieldErrors({});
    setWarning(null);

    try {
      let result: Channel;
      if (isExistingChannel) {
        result = await omnichannelService.updateChannel(channel.id, {
          config: configValues,
        });
      } else {
        result = await omnichannelService.createChannel({
          type: channel.type,
          name: channel.name,
          description: channel.description ?? undefined,
          config: configValues,
        });
      }
      setSavedChannel(result);
      onSaved?.();
      if (currentStep < totalSteps - 1) {
        setCurrentStep(totalSteps - 1);
      }
    } catch (err: any) {
      const response = err?.response;
      if (response?.status === 400 && response?.data?.errors) {
        setFieldErrors(response.data.errors);
        if (fieldStepIndex >= 0) setCurrentStep(fieldStepIndex);
      } else if (response?.data?.warning) {
        setWarning(response.data.warning);
      } else {
        setFieldErrors({
          _general: response?.data?.error || t("saveError"),
        });
      }
    }
    setIsSaving(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetState();
  };

  // ── Render Helpers ───────────────────────────────────────────────────────

  const renderField = (field: ConfigField) => {
    const value = configValues[field.key] ?? "";
    const error = fieldErrors[field.key];
    const inputClass = cn(
      "w-full h-10 px-3 bg-white border rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all",
      error ? "border-red-300 bg-red-50/40" : "border-gray-200",
    );
    const errorEl = error ? (
      <p className="text-[11px] text-red-500 mt-1">{error}</p>
    ) : null;

    switch (field.type) {
      case "text":
      case "url":
      case "password":
        return (
          <>
            <input
              type={field.type === "password" ? "password" : "text"}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
            />
            {errorEl}
          </>
        );
      case "number":
        return (
          <>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
            />
            {errorEl}
          </>
        );
      case "boolean":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-200"
            />
            <span className="text-sm text-gray-600">{t("enable")}</span>
          </label>
        );
      case "select":
        return (
          <>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className={inputClass}
            >
              <option value="">{t("selectOption")}</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errorEl}
          </>
        );
      case "list": {
        const items = (configValues[field.key] as string[]) || [];
        const inputValue = listInputValues[field.key] ?? "";
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) =>
                  setListInputValues((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddListItem(field.key);
                  }
                }}
                placeholder={field.placeholder}
                className={cn(inputClass, "flex-1")}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-lg text-xs"
                onClick={() => handleAddListItem(field.key)}
              >
                {t("add")}
              </Button>
            </div>
            {items.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {items.map((item, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleRemoveListItem(field.key, i)}
                  >
                    {item}
                    <span className="text-gray-400">&times;</span>
                  </Badge>
                ))}
              </div>
            )}
            {errorEl}
          </div>
        );
      }
      default:
        return null;
    }
  };

  // ── OAuth UI states ──────────────────────────────────────────────────────

  const renderOAuthContent = () => {
    if (oauthState === "success") {
      return (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center ring-4 ring-green-100">
            <CheckCircle className="!text-3xl text-green-500" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-900">
              {t("channelConnected")}
            </h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              {t("oauthSuccess", { channel: channelLabels[channel.type] })}
            </p>
          </div>
        </div>
      );
    }

    if (oauthState === "error") {
      return (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center ring-4 ring-red-100">
            <ErrorOutline className="!text-3xl text-red-400" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-900">
              {t("oauthFailed")}
            </h4>
            <p className="text-xs text-red-500 mt-1 max-w-sm">{oauthError}</p>
          </div>
          <Button
            size="sm"
            className="gap-1.5 text-xs rounded-lg"
            onClick={() => {
              setOauthState("idle");
              setOauthError(null);
            }}
          >
            {t("tryAgain")}
          </Button>
        </div>
      );
    }

    if (
      oauthState === "loading" ||
      oauthState === "waiting" ||
      oauthState === "polling"
    ) {
      return (
        <div className="flex flex-col items-center gap-3 py-6">
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
      );
    }

    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <Button
          size="lg"
          className="gap-2 rounded-xl px-8 shadow-sm"
          onClick={startOAuth}
        >
          <Login className="!text-lg" />
          {t("connectWith", { channel: channelLabels[channel.type] })}
        </Button>
        <p className="text-[11px] text-gray-400 text-center max-w-xs">
          {t("oauthHint")}
        </p>
      </div>
    );
  };

  const CopyRow = ({
    id,
    value,
    label,
    hint,
    mono = false,
    rightSlot,
  }: {
    id: string;
    value: string;
    label?: string;
    hint?: string;
    mono?: boolean;
    rightSlot?: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      {(label || rightSlot) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              {label}
            </label>
          )}
          {rightSlot}
        </div>
      )}
      <div className="flex items-stretch gap-0 rounded-lg ring-1 ring-gray-200 bg-gray-50 overflow-hidden">
        <code
          className={cn(
            "flex-1 text-xs px-3 py-2.5 break-all text-gray-700",
            mono && "font-mono",
          )}
        >
          {value}
        </code>
        <button
          type="button"
          onClick={() => handleCopy(value, id)}
          className="shrink-0 px-3 flex items-center gap-1 text-xs font-medium text-gray-600 hover:bg-gray-100 border-l border-gray-200 transition-colors"
        >
          {copied === id ? (
            <>
              <Check className="!text-sm text-green-500" />
              <span className="text-green-600">{t("copied")}</span>
            </>
          ) : (
            <>
              <ContentCopy className="!text-sm" />
              {t("copy")}
            </>
          )}
        </button>
      </div>
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );

  // ── Main Render ──────────────────────────────────────────────────────────

  const stepHeading = steps[currentStep];
  const showSideRail = totalSteps > 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden max-h-[90vh] flex flex-col",
          showSideRail ? "max-w-3xl" : "max-w-xl",
        )}
      >
        {/* Hero header — channel-tinted gradient spanning full width */}
        <DialogHeader
          className={cn(
            "px-6 pt-6 pb-5 bg-gradient-to-br border-b border-gray-100",
            hero.bg,
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ring-4",
                hero.iconBg,
                hero.ring,
              )}
            >
              <ChannelIcon channel={channel.type} className="!text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-[15px] font-semibold text-gray-900">
                {isExistingChannel
                  ? t("configureTitle", {
                      channel: channelLabels[channel.type],
                    })
                  : t("connectTitle", {
                      channel: channelLabels[channel.type],
                    })}
              </DialogTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                {t("configureSubtitle")}
              </p>
            </div>
            {showSideRail && !showResult && (
              <span className="text-[11px] font-medium text-gray-500 bg-white/70 ring-1 ring-gray-200 rounded-full px-2.5 py-1 shrink-0">
                {currentStep + 1} / {totalSteps}
              </span>
            )}
          </div>
        </DialogHeader>

        {/* Body: optional side rail (vertical stepper) + main content */}
        <div className="flex-1 flex min-h-0">
          {showSideRail && (
            <aside
              className={cn(
                "w-48 shrink-0 border-r border-gray-100 px-3 py-5",
                hero.rail,
              )}
            >
              <ol className="flex flex-col gap-1">
                {steps.map((s, i) => {
                  const done = i < currentStep;
                  const active = i === currentStep;
                  const completedAll = showResult || oauthState === "success";
                  const stepDone = done || completedAll;
                  return (
                    <li key={i}>
                      <div
                        className={cn(
                          "flex items-start gap-2.5 px-2.5 py-2 rounded-lg transition-colors",
                          active &&
                            "bg-white shadow-sm ring-1 ring-gray-200",
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 transition-colors",
                            stepDone && "bg-green-500 text-white",
                            active &&
                              !stepDone &&
                              cn(hero.accent, "text-white"),
                            !stepDone &&
                              !active &&
                              "bg-gray-200 text-gray-500",
                          )}
                        >
                          {stepDone ? (
                            <Check className="!text-[12px]" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[11px] leading-tight font-medium pt-0.5",
                            active
                              ? "text-gray-900"
                              : stepDone
                                ? "text-gray-500"
                                : "text-gray-400",
                          )}
                        >
                          {s.title}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </aside>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 min-w-0">
            {/* Step heading — direct, no nested card */}
            {!showResult && (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {stepHeading.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {stepHeading.description}
                </p>
                {stepHeading.externalUrl && (
                  <a
                    href={stepHeading.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium mt-1",
                      hero.railText,
                    )}
                  >
                    {t("openExternalLink")}
                    <OpenInNew className="!text-xs" />
                  </a>
                )}
              </div>
            )}

            {oauth && !isExistingChannel && renderOAuthContent()}

            {warning && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-yellow-50 border border-yellow-100 rounded-lg">
                <Warning className="!text-sm text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-xs text-yellow-700">{warning}</span>
              </div>
            )}

            {fieldErrors._general && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
                <Warning className="!text-sm text-red-400 mt-0.5 shrink-0" />
                <span className="text-xs text-red-600">
                  {fieldErrors._general}
                </span>
              </div>
            )}

            {webhookUrl && (
              <div className="space-y-3">
                <CopyRow
                  id="webhook-url"
                  label={t("webhookUrl")}
                  value={webhookUrl}
                  hint={t("webhookUrlHint")}
                />
                {webhookVerifyToken && (
                  <CopyRow
                    id="webhook-verify"
                    label="Verify token"
                    value={webhookVerifyToken}
                    mono
                    hint="Paste this into the Meta App Dashboard → Webhooks → Verify token field. Meta calls our endpoint with this token to confirm we own it."
                  />
                )}
              </div>
            )}

            {(widgetToken || existingLiveChatToken) && (
              <div className="space-y-4">
                <CopyRow
                  id="widget-token"
                  label="Widget token"
                  value={(widgetToken ?? existingLiveChatToken)!}
                  mono
                  rightSlot={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-[11px] h-7 gap-1 text-gray-500 hover:text-gray-700"
                      onClick={handleRegenerateToken}
                      disabled={isRotating}
                    >
                      <Refresh
                        className={cn(
                          "!text-sm",
                          isRotating && "animate-spin",
                        )}
                      />
                      {isRotating ? "Rotating…" : "Regenerate"}
                    </Button>
                  }
                />
                <p className="text-[11px] text-gray-400 -mt-2">
                  Rotating immediately invalidates the previous token, so
                  update any deployed widgets right after.
                </p>

                {/* Installation — CDN script tag. */}
                <InstallSnippet
                  token={(widgetToken ?? existingLiveChatToken)!}
                  copied={copied}
                  onCopy={handleCopy}
                  t={t}
                />
              </div>
            )}

            {showFieldsOnCurrentStep && !showResult && (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                      {field.label}
                      {field.required && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          {showResult || oauthState === "success" ? (
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
          ) : oauth && !isExistingChannel ? (
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
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs rounded-lg"
                disabled={currentStep === 0 || isSaving}
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                <ArrowBack className="!text-sm" />
                {t("back")}
              </Button>

              {isLastStep || (showFieldsOnCurrentStep && !savedChannel) ? (
                <Button
                  size="sm"
                  className="gap-1.5 text-xs rounded-lg shadow-sm"
                  onClick={handleSave}
                  disabled={isSaving}
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
              ) : (
                <Button
                  size="sm"
                  className="gap-1.5 text-xs rounded-lg shadow-sm"
                  onClick={() => setCurrentStep((s) => s + 1)}
                >
                  {t("next")}
                  <ArrowForward className="!text-sm" />
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/** CDN URL for the standalone, vanilla-JS bundle of the chat widget.
 * Reads its config from `data-innocalls-*` attributes on the script tag
 * (see chat-widget/src/embed.ts:readScriptProps). */
const CHAT_WIDGET_CDN =
  "https://innocalls-statics.s3.ap-south-1.amazonaws.com/innocalls-chat-widget.js";

const buildScriptSnippet = (token: string) =>
  `<script\n  src="${CHAT_WIDGET_CDN}"\n  data-innocalls-token="${token}"\n  async\n></script>`;

/** Installation snippet shown after a live_chat channel has been
 * connected. Currently exposes the CDN script tag only. */
const InstallSnippet = ({
  token,
  copied,
  onCopy,
  t,
}: {
  token: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
  t: (k: string) => string;
}) => {
  const snippet = buildScriptSnippet(token);
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        Installation
      </label>
      <div className="flex items-stretch gap-0 rounded-lg ring-1 ring-gray-200 bg-gray-50 overflow-hidden">
        <pre className="flex-1 text-xs px-3 py-2.5 break-all whitespace-pre-wrap text-gray-700 font-mono">
          {snippet}
        </pre>
        <button
          type="button"
          onClick={() => onCopy(snippet, "install-script")}
          className="shrink-0 px-3 flex items-center gap-1 text-xs font-medium text-gray-600 hover:bg-gray-100 border-l border-gray-200 transition-colors"
        >
          {copied === "install-script" ? (
            <>
              <Check className="!text-sm text-green-500" />
              <span className="text-green-600">{t("copied")}</span>
            </>
          ) : (
            <>
              <ContentCopy className="!text-sm" />
              {t("copy")}
            </>
          )}
        </button>
      </div>
      <p className="text-[11px] text-gray-400">
        Paste this {"<script>"} tag into your site's HTML, ideally just before{" "}
        {"</body>"}. The widget loads asynchronously and mounts itself.
      </p>
    </div>
  );
};

export default ChannelSetupDialog;
