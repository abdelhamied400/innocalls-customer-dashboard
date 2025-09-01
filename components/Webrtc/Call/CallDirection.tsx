import { CallMade, CallReceived } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";

type CallDirectionProps = {
  direction?: "incoming" | "outgoing";
};
const CallDirection = ({ direction }: CallDirectionProps) => {
  const t = useTranslations("webrtc.direction");

  return (
    <div className="flex items-center justify-center gap-2">
      {direction === "incoming" && (
        <div className="flex items-center gap-1 text-success-500">
          <CallReceived />
          {t("incoming")}
        </div>
      )}

      {direction === "outgoing" && (
        <div className="flex items-center gap-1 text-primary-500">
          <CallMade />
          {t("outgoing")}
        </div>
      )}
    </div>
  );
};

export default CallDirection;
