import { useSip } from "@/providers/webrtc/SipProvider";
import { Button } from "../ui/button";
import { CallEnd } from "@mui/icons-material";

const CallScreen = () => {
  const { number, currentSession } = useSip();

  const handleHangup = () => {
    currentSession?.terminate();
  };

  return (
    <div className="screen" id="call-screen">
      <h4>{number}</h4>
      <h1>name</h1>
      <Button
        size="icon"
        className="[&_svg]:size-8 size-12 rounded-full w-16 h-16"
        variant="destructive"
        onClick={handleHangup}
      >
        <CallEnd />
      </Button>
    </div>
  );
};

export default CallScreen;
