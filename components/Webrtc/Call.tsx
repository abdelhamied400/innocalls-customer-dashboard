import { useSip } from "@/providers/webrtc/SipProvider";
import { Button } from "../ui/button";
import { CallEnd } from "@mui/icons-material";
import CallActions from "./Call/CallActions";
import CallDirection from "./Call/CallDirection";
import CallState from "./Call/CallState";
import { cn } from "@/lib/utils";

const Call = () => {
  const { currentSession, sessionState, isSpying, spyingStatus } = useSip();
  const number = currentSession?.remote_identity?.uri?.user.replace("*199", "");
  const name = currentSession?.remote_identity?.display_name;

  const handleHangup = () => {
    currentSession?.terminate();
  };

  return (
    <div className="screen" id="call-screen">
      <div className="flex flex-col gap-2">
        <CallDirection direction={currentSession?.direction} />
        {/* if session is spying, show the spying message */}
        {isSpying && (
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn("w-4 h-4 rounded-full animate-pulse", {
                "bg-destructive-500": spyingStatus === "whisper",
                "bg-primary-500": spyingStatus === "barrage",
                "bg-success-500": spyingStatus === "spy",
              })}
            ></div>
            <p
              className={cn("text-sm font-semibold", {
                "text-destructive-500": spyingStatus === "whisper",
                "text-primary-500": spyingStatus === "barrage",
                "text-success-500": spyingStatus === "spy",
              })}
            >
              {spyingStatus}
            </p>
          </div>
        )}
        {number && <h4 className="text-center"> {"\u200E" + number}</h4>}
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
