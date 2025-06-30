import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSip } from "@/providers/webrtc/SipProvider";

const ExtensionStateBar = () => {
  const { extension, extensionState, reconnect } = useSip();

  if (!extension) return null;

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
        {extension?.ext} {extensionState}
      </p>
      {extensionState === "disconnected" && (
        <Button onClick={reconnect} size="sm" variant="link">
          Reconnect?
        </Button>
      )}
    </div>
  );
};

export default ExtensionStateBar;
