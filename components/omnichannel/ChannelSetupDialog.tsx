"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Channel } from "@/types/omnichannel";
import { useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  const [copied, setCopied] = useState(false);

  // OAuth state
  const [oauthState, setOauthState] = useState<
    "idle" | "loading" | "waiting" | "polling" | "success" | "error"
  >("idle");
  const [oauthError, setOauthError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Live-chat token rotation
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

  // Clean up polling on unmount
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

  // Webhook info: provider apps (WhatsApp/Messenger/Instagram) require pasting
  // a callback URL + verify token into the Meta App Dashboard. Show these
  // whenever they're available — both right after a fresh connect (from
  // savedChannel) and on Configure of an existing connected channel.
  const sourceConfig = (savedChannel?.config ?? channel.config ?? {}) as Record<
    string,
    unknown
  >;
  const webhookUrl = sourceConfig.webhookUrl as string | undefined;
  const webhookVerifyToken = sourceConfig.webhookVerifyToken as
    | string
    | undefined;

  // For an existing live_chat channel being reconfigured, show its current
  // token + rotate button regardless of the wizard step.
  const existingLiveChatToken =
    isExistingChannel && channel.type === "live_chat" && !savedChannel
      ? (channel.widgetToken ?? null)
      : null;
  const existingLiveChatSnippet =
    existingLiveChatToken
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
    // Browsers (Chrome/Safari) only allow window.open inside the synchronous
    // task chain of a user gesture. Awaiting the API call first would forfeit
    // the gesture and trip the popup blocker. Open a placeholder window
    // immediately, then redirect it once the URL comes back.
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

      // Listen for popup close and postMessage
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

      // Also poll for status in case postMessage doesn't work (popup on different origin)
      setOauthState("polling");
      pollRef.current = setInterval(async () => {
        // Check if popup was closed by user
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
              // Popup closed but OAuth not completed — user cancelled
              setOauthState("idle");
            }
          } catch {
            setOauthState("idle");
          }
          return;
        }

        // Poll status while popup is open
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
          // Polling error — continue
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

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      // If the field step isn't the last step (i.e. there's a result step
      // after it — like live_chat's "Copy your token" reveal), advance.
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
      "w-full h-9 px-3 bg-gray-50 border rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all",
      error ? "border-red-300 bg-red-50/50" : "border-gray-200",
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
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="!text-3xl text-green-500" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-900">
              {t("channelConnected")}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {t("oauthSuccess", { channel: channelLabels[channel.type] })}
            </p>
          </div>
        </div>
      );
    }

    if (oauthState === "error") {
      return (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <ErrorOutline className="!text-3xl text-red-400" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-900">
              {t("oauthFailed")}
            </h4>
            <p className="text-xs text-red-500 mt-1">{oauthError}</p>
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
        <div className="flex flex-col items-center gap-4 py-6">
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
      );
    }

    // idle — show connect button
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <Button
          size="lg"
          className="gap-2 rounded-xl px-8"
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

  // ── Main Render ──────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <ChannelIcon channel={channel.type} className="!text-2xl" />
            <div>
              <DialogTitle className="text-base">
                {isExistingChannel
                  ? t("configureTitle", {
                      channel: channelLabels[channel.type],
                    })
                  : t("connectTitle", {
                      channel: channelLabels[channel.type],
                    })}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {t("configureSubtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-1 px-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full flex-1 transition-colors",
                i <= currentStep ? "bg-primary-500" : "bg-gray-100",
              )}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto py-2 space-y-4">
          {/* Step info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  oauthState === "success" || showResult
                    ? "bg-green-500 text-white"
                    : "bg-primary-500 text-white",
                )}
              >
                {oauthState === "success" || showResult ? (
                  <CheckCircle className="!text-sm" />
                ) : (
                  currentStep + 1
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {steps[currentStep].title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {steps[currentStep].description}
                </p>
                {steps[currentStep].externalUrl && (
                  <a
                    href={steps[currentStep].externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium mt-2"
                  >
                    {t("openExternalLink")}
                    <OpenInNew className="!text-xs" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* OAuth flow content */}
          {oauth && !isExistingChannel && renderOAuthContent()}

          {/* Warning from API */}
          {warning && (
            <div className="flex items-start gap-2 px-3 py-2 bg-yellow-50 border border-yellow-100 rounded-lg">
              <Warning className="!text-sm text-yellow-500 mt-0.5 shrink-0" />
              <span className="text-xs text-yellow-700">{warning}</span>
            </div>
          )}

          {/* General error */}
          {fieldErrors._general && (
            <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
              <Warning className="!text-sm text-red-400 mt-0.5 shrink-0" />
              <span className="text-xs text-red-600">
                {fieldErrors._general}
              </span>
            </div>
          )}

          {/* Webhook info — visible right after a fresh connect AND on Configure
              of an existing connected provider channel, so the user can copy
              the callback URL + verify token into the Meta App Dashboard. */}
          {webhookUrl && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  {t("webhookUrl")}
                </label>
                <div className="flex gap-2 mt-1.5">
                  <code className="flex-1 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 break-all text-gray-600">
                    {webhookUrl}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-lg text-xs gap-1"
                    onClick={() => handleCopy(webhookUrl)}
                  >
                    <ContentCopy className="!text-sm" />
                    {copied ? t("copied") : t("copy")}
                  </Button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {t("webhookUrlHint")}
                </p>
              </div>

              {webhookVerifyToken && (
                <div className="pt-3 border-t border-gray-100">
                  <label className="text-xs font-medium text-gray-700">
                    Verify token
                  </label>
                  <div className="flex gap-2 mt-1.5">
                    <code className="flex-1 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 break-all text-gray-600 font-mono">
                      {webhookVerifyToken}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 rounded-lg text-xs gap-1"
                      onClick={() => handleCopy(webhookVerifyToken)}
                    >
                      <ContentCopy className="!text-sm" />
                      {copied ? t("copied") : t("copy")}
                    </Button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Paste this into the Meta App Dashboard → Webhooks →
                    Verify token field. Meta calls our endpoint with this
                    token to confirm we own it.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Embed snippet result */}
          {showResult && embedSnippet && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
              <label className="text-xs font-medium text-gray-700">
                {t("embedSnippet")}
              </label>
              <div className="flex gap-2">
                <code className="flex-1 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 break-all text-gray-600">
                  {embedSnippet}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-lg text-xs gap-1"
                  onClick={() => handleCopy(embedSnippet)}
                >
                  <ContentCopy className="!text-sm" />
                  {copied ? t("copied") : t("copy")}
                </Button>
              </div>
              <p className="text-[11px] text-gray-400">
                {t("embedSnippetHint")}
              </p>
            </div>
          )}

          {/* Widget token block — for live_chat (after create OR existing) */}
          {(widgetToken || existingLiveChatToken) && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-medium text-gray-700">
                  Widget token
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs gap-1"
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
              </div>
              <div className="flex gap-2">
                <code className="flex-1 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 break-all text-gray-600 font-mono">
                  {widgetToken ?? existingLiveChatToken}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-lg text-xs gap-1"
                  onClick={() =>
                    handleCopy(widgetToken ?? existingLiveChatToken!)
                  }
                >
                  <ContentCopy className="!text-sm" />
                  {copied ? t("copied") : t("copy")}
                </Button>
              </div>
              {existingLiveChatSnippet && !widgetToken && (
                <div className="flex gap-2">
                  <code className="flex-1 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 break-all text-gray-600">
                    {existingLiveChatSnippet}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-lg text-xs gap-1"
                    onClick={() => handleCopy(existingLiveChatSnippet)}
                  >
                    <ContentCopy className="!text-sm" />
                    {copied ? t("copied") : t("copy")}
                  </Button>
                </div>
              )}
              <p className="text-[11px] text-gray-400">
                Pass this token to the chat widget. Rotating immediately
                invalidates the previous token, so update any deployed widgets
                right after.
              </p>
            </div>
          )}

          {/* Completed steps summary */}
          {currentStep > 0 && !showResult && oauthState !== "success" && (
            <div className="space-y-1.5">
              {steps.slice(0, currentStep).map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-gray-400 px-1"
                >
                  <CheckCircle className="!text-sm text-green-400" />
                  <span>{step.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Config fields (manual channels, or existing OAuth channel being reconfigured) */}
          {showFieldsOnCurrentStep && !showResult && (
            <div className="space-y-3 px-1">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
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

        {/* Navigation footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {showResult || oauthState === "success" ? (
            <>
              <div />
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-lg"
                onClick={handleClose}
              >
                {t("done")}
              </Button>
            </>
          ) : oauth && !isExistingChannel ? (
            // OAuth channels — minimal footer, no back/next since connect button is the action
            <>
              <div />
              <div className="text-[11px] text-gray-400">
                {currentStep + 1} / {totalSteps}
              </div>
              <div />
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

              <div className="text-[11px] text-gray-400">
                {currentStep + 1} / {totalSteps}
              </div>

              {isLastStep ||
              (showFieldsOnCurrentStep && !savedChannel) ? (
                <Button
                  size="sm"
                  className="gap-1.5 text-xs rounded-lg"
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
                  className="gap-1.5 text-xs rounded-lg"
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

export default ChannelSetupDialog;
