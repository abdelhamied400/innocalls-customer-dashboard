import { useSip } from "@/providers/webrtc/SipProvider";
import { Button } from "../ui/button";
import { CallEnd, Phone } from "@mui/icons-material";
import { SessionDirection } from "jssip/src/RTCSession";
import { useTranslations } from "@/providers/TranslationProvider";
import { webrtcLogger } from "@/lib/logger";

const IncomingCall = () => {
  const t = useTranslations("webrtc");

  const { currentSession } = useSip();
  const number =
    currentSession?.remote_identity?.uri?.user || t("ua.unknownName");
  const name =
    currentSession?.remote_identity?.display_name || t("ua.unknownNumber");
  const direction = currentSession?.direction;

  const handleHangup = () => {
    currentSession?.terminate();
  };

  const handleAnswer = () => {
    if (currentSession) {
      currentSession.answer({
        mediaConstraints: { audio: true, video: false },
      });

      currentSession.connection.addEventListener("addstream", (e: any) => {
        webrtcLogger.debug("Stream added", e);
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = e.stream;
        remoteAudio.play();
      });

      currentSession.connection.addEventListener("track", (e: any) => {
        webrtcLogger.debug("Track event", e);
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = e.streams && e.streams[0] ? e.streams[0] : null;
        remoteAudio.play();
      });
    }
  };

  return (
    <div className="screen" id="incoming-call-screen">
      <div className="flex flex-col gap-2">
        <h4 className="text-center">
          {direction === ("incoming" as SessionDirection) &&
            t("direction.incoming")}
          {direction === ("outgoing" as SessionDirection) &&
            t("direction.incoming")}
        </h4>
        {number && <h4 className="text-center">{number}</h4>}
        {name && <h2 className="text-center">{name}</h2>}
        <div className="grid grid-cols-2 gap-5 place-items-center">
          <Button
            size="icon"
            className="[&_svg]:size-8 size-12 rounded-full w-16 h-16"
            variant="destructive"
            onClick={handleHangup}
          >
            <CallEnd />
          </Button>
          <Button
            size="icon"
            className="[&_svg]:size-8 size-12 rounded-full w-16 h-16"
            variant="success"
            onClick={handleAnswer}
          >
            <Phone />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
