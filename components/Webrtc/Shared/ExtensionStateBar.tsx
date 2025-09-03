import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSip } from "@/providers/webrtc/SipProvider";
import { useTranslations } from "@/providers/TranslationProvider";

const ExtensionStateBar = () => {
  const t = useTranslations("webrtc");

  const { extension, extensionState, reconnect } = useSip();

  console.log(
    "ExtensionStateBar - extension:",
    extension,
    "extensionState:",
    extensionState
  );

  if (!extension) {
    console.log("ExtensionStateBar - No extension, not rendering");
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4",
        extensionState === "disconnected" && "bg-destructive-200",
        extensionState === "connected" && "bg-success-200",
        extensionState === "connecting" && "bg-warning-200"
      )}
    >
      <p className="">
        {extension?.ext} {t("status." + extensionState)}
      </p>
      {extensionState === "disconnected" && (
        <Button onClick={reconnect} size="sm" variant="link">
          {t("actions.reconnect")}
        </Button>
      )}
    </div>
  );
};

export default ExtensionStateBar;
