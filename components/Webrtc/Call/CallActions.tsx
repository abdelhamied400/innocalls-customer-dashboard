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

const CallActions = () => {
  const { currentSession } = useSip();
  const [muted, setIsMuted] = useState(false);
  const [hold, setIsHold] = useState(false);

  const handleToggleMute = () => {
    // Handle mute logic here
    console.log("Mute action triggered");
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
    console.log("Hold action triggered");
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
    console.log("Open contacts action triggered");
  };

  const handleOpenDialpad = () => {
    // Handle opening dialpad logic here
    console.log("Open dialpad action triggered");
  };

  return (
    <div className="call-actions grid grid-cols-3 gap-2 place-items-center">
      <Button
        variant="ghost"
        className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
        onClick={handleToggleMute}
        size="icon"
      >
        {muted ? <MicOff /> : <Mic />}
        {muted ? <p>Unmute</p> : <p>Mute</p>}
      </Button>
      <Button
        variant="ghost"
        className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
        onClick={handleToggleHold}
        size="icon"
      >
        {hold ? <PauseCircleOutline /> : <PlayCircleOutline />}
        {hold ? <p>Resume</p> : <p>Hold</p>}
      </Button>
      <Button
        variant="ghost"
        className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
        onClick={handleOpenContacts}
      >
        <PermContactCalendar />
        <p>Contacts</p>
      </Button>
      <Button
        variant="ghost"
        className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
        onClick={handleOpenDialpad}
        size="icon"
      >
        <Dialpad />
        <p>Dialpad</p>
      </Button>
    </div>
  );
};

export default CallActions;
