import { Button } from "@/components/ui/button";
import { useSip } from "@/providers/webrtc/SipProvider";
import {
  Dialpad,
  Mic,
  MicOff,
  PauseCircleOutline,
  PermContactCalendar,
  PlayCircleOutline,
} from "@mui/icons-material";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Digit from "../Shared/Digit";
import { digits } from "@/constants/digits";
import { Input } from "@/components/ui/input";
import { webrtcLogger } from "@/lib/logger";
import { useTranslations } from "next-intl";

const CallActions = () => {
  const t = useTranslations("webrtc");

  const { currentSession, sessionState } = useSip();
  const [muted, setIsMuted] = useState(false);
  const [hold, setIsHold] = useState(false);
  const [dtmfValue, setDtmfValue] = useState("");

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
            size="icon"
            disabled={!currentSession || sessionState !== "answered"}
          >
            <Dialpad />
            <p>{t("callActions.dialpad")}</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="dtmf flex flex-col gap-2 p-4">
            <Input
              value={dtmfValue}
              readOnly
              placeholder={t("callActions.phone.placeholder")}
            />
            <div className="digits grid grid-cols-3 gap-5 place-items-center p-4">
              {digits.map((digit) => (
                <Digit
                  key={digit.number}
                  digit={digit}
                  onClick={() => handleDTMFClick(digit.value)}
                />
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CallActions;
