import { Button } from "@/components/ui/button";
import { useSip } from "@/providers/webrtc/SipProvider";
import {
  Close,
  ConnectWithoutContact,
  Dialpad,
  InterpreterMode,
  Mic,
  MicOff,
  PauseCircleOutline,
  PermContactCalendar,
  PlayCircleOutline,
} from "@mui/icons-material";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Digit from "../Shared/Digit";
import { digits } from "@/constants/digits";
import { Input } from "@/components/ui/input";
import { webrtcLogger } from "@/lib/logger";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const CallActions = () => {
  const t = useTranslations("webrtc");

  const {
    currentSession,
    sessionState,
    spyingStatus,
    isSpying,
    setSpyingStatus,
  } = useSip();
  const [muted, setIsMuted] = useState(false);
  const [hold, setIsHold] = useState(false);
  const [dtmfValue, setDtmfValue] = useState("");
  const [dtmfOpen, setDtmfOpen] = useState(false);

  const handleToggleMute = () => {
    // Handle mute logic here
    webrtcLogger.info("Toggle mute action triggered");
    if (currentSession) {
      if (currentSession.isMuted().audio) {
        currentSession.unmute({ audio: true });
        setIsMuted(false);
      } else {
        currentSession.mute({ audio: true });
        setIsMuted(true);
      }
    }
  };

  const handleToggleHold = () => {
    // Handle hold logic here
    webrtcLogger.info("Toggle hold action triggered");
    if (currentSession) {
      if (currentSession.isOnHold().local) {
        currentSession.unhold();
        setIsHold(false);
      } else {
        currentSession.hold();
        setIsHold(true);
      }
    }
  };

  const handleOpenContacts = () => {
    // Handle opening contacts logic here
    webrtcLogger.info("Open contacts action triggered");
  };

  const handleDTMFClick = (value: string) => {
    setDtmfValue((prev) => prev + value);
    if (currentSession) {
      currentSession.sendDTMF(value);
      webrtcLogger.info("DTMF sent", { value });
    }
  };

  const handleToggleWhisper = () => {
    if (currentSession && isSpying) {
      if (spyingStatus === "whisper") {
        handleDTMFClick("4");
        setSpyingStatus("spy");
        webrtcLogger.info("Switched to spy mode");
      } else {
        handleDTMFClick("5");
        setSpyingStatus("whisper");
        webrtcLogger.info("Switched to whisper mode");
      }
    }
  };

  const handleToggleBarrage = () => {
    if (currentSession && isSpying) {
      if (spyingStatus === "barrage") {
        handleDTMFClick("4");
        setSpyingStatus("spy");
        webrtcLogger.info("Switched to spy mode");
      } else {
        handleDTMFClick("6");
        setSpyingStatus("barrage");
        webrtcLogger.info("Switched to barrage mode");
      }
    }
  };

  return (
    <div className="call-actions grid grid-cols-3 gap-2 place-items-center">
      <Button
        variant="ghost"
        className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
        onClick={handleToggleMute}
        size="icon"
        disabled={!currentSession || sessionState !== "answered"}
      >
        {muted ? <MicOff /> : <Mic />}
        {muted ? (
          <p>{t("callActions.unMute")}</p>
        ) : (
          <p>{t("callActions.mute")}</p>
        )}
      </Button>
      <Button
        variant="ghost"
        className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
        onClick={handleToggleHold}
        size="icon"
        disabled={!currentSession || sessionState !== "answered"}
      >
        {hold ? <PauseCircleOutline /> : <PlayCircleOutline />}
        {hold ? (
          <p> {t("callActions.resume")} </p>
        ) : (
          <p>{t("callActions.hold")}</p>
        )}
      </Button>
      <Button
        variant="ghost"
        className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
        onClick={handleOpenContacts}
        size="icon"
        disabled={!currentSession || sessionState !== "answered"}
      >
        <PermContactCalendar />
        <p>{t("contacts.title")}</p>
      </Button>

      <Dialog open={dtmfOpen} onOpenChange={setDtmfOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
            size="icon"
            disabled={!currentSession || sessionState !== "answered"}
          >
            <Dialpad />
            <p>{t("callActions.dialpad")}</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("callActions.dialpad")}</DialogTitle>
          </DialogHeader>
          <div className="dtmf flex flex-col gap-4">
            <Input
              value={dtmfValue}
              readOnly
              placeholder={t("callActions.phone.placeholder")}
            />
            <div className="digits grid grid-cols-3 gap-4 place-items-center">
              {digits.map((digit) => (
                <Digit
                  key={digit.number}
                  digit={digit}
                  onClick={() => handleDTMFClick(digit.value)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isSpying && (
        <Button
          variant="ghost"
          className={cn(
            "[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal",
            spyingStatus === "whisper" && "bg-primary-200"
          )}
          onClick={handleToggleWhisper}
          size="icon"
          disabled={!currentSession || sessionState !== "answered"}
        >
          <ConnectWithoutContact />
          <p>{t("callActions.whisper")}</p>
        </Button>
      )}
      {isSpying && (
        <Button
          variant="ghost"
          className={cn(
            "[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal",
            spyingStatus === "barrage" && "bg-primary-200"
          )}
          onClick={handleToggleBarrage}
          size="icon"
          disabled={!currentSession || sessionState !== "answered"}
        >
          <InterpreterMode />
          <p>{t("callActions.barrage")}</p>
        </Button>
      )}
    </div>
  );
};

export default CallActions;
