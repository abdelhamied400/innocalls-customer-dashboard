import CallTimer from "./CallTimer";
import { cn } from "@/lib/utils";
import { SessionState } from "@/providers/webrtc/SipProvider/types";
import { useTranslations } from "@/providers/TranslationProvider";
import useWebrtcStore from "@/store/webrtc.slice";

type CallStateProps = {
  state?: SessionState;
};
const CallState = ({ state }: CallStateProps) => {
  const t = useTranslations("webrtc.state");
  const { callStartTime } = useWebrtcStore();

  return (
    <div className="flex flex-col gap-2">
      <div className="session-status flex items-center justify-center gap-2">
        <div
          className={cn(
            "w-4 h-4 rounded-full",
            state === "answered" && "bg-success-500",
            state === "ringing" && "bg-primary-500",
            state === "trying" && "bg-indigo-500",
            state === "ended" && "bg-warning-500",
            state === "user_denied_media" && "bg-pink-500",
            state === "failed" && "bg-destructive-500",
          )}
        ></div>
        <p
          className={cn(
            state === "answered" && "text-success-500",
            state === "ringing" && "text-primary-500",
            state === "trying" && "text-indigo-500",
            state === "ended" && "text-warning-500",
            state === "user_denied_media" && "text-pink-500",
            state === "failed" && "text-destructive-500",
          )}
        >
          {t(`${state}`)}
        </p>
      </div>
      <div className="flex items-center justify-center gap-2">
        {state === "answered" && (
          <h4 className="text-center">
            <CallTimer startTime={callStartTime} />
          </h4>
        )}
      </div>
    </div>
  );
};

export default CallState;
