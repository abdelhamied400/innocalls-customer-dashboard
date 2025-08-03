import { useSip } from "@/providers/webrtc/SipProvider";
import { Button } from "../ui/button";
import { CallEnd, CallMade, CallReceived } from "@mui/icons-material";
import CallActions from "./Call/CallActions";
import { SessionDirection } from "jssip/lib/RTCSession";
import Timer from "../ui/timer";
import { cn } from "@/lib/utils";
import CallDirection from "./Call/CallDirection";
import CallState from "./Call/CallState";

const Call = () => {
  const { currentSession, sessionState } = useSip();
  const number = currentSession?.remote_identity?.uri?.user;
  const name = currentSession?.remote_identity?.display_name;

  const handleHangup = () => {
    currentSession?.terminate();
  };

  return (
    <div className="screen" id="call-screen">
      <div className="flex flex-col gap-2">
        <CallDirection direction={currentSession?.direction} />
        {number && <h4 className="text-center">{number}</h4>}
        {name && <h2 className="text-center">{name}</h2>}
        {/* if session status is confirmed */}
        <CallState state={sessionState} />

        <CallActions />
        <div className="grid grid-cols-3 gap-5 place-items-center">
          <div className=""></div>
          <Button
            size="icon"
            className="[&_svg]:size-8 size-12 rounded-full w-16 h-16"
            variant="destructive"
            onClick={handleHangup}
          >
            <CallEnd />
          </Button>
          <div className=""></div>
        </div>
      </div>
    </div>
  );
};

export default Call;
