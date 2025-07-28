import { CallMade, CallReceived } from "@mui/icons-material";
import Timer from "../ui/timer";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSip } from "@/providers/webrtc/SipProvider";
import useAppStore from "@/store/app.slice";

interface LiveCallProps {
  from: string;
  to: string;
  timestamp: number;
}

const getExtensionNumber = (phoneNumber: string): string => {
  // if the phone number has something like that name (ext)
  const match = phoneNumber.match(/\((\d+)\)/);
  return match ? match[1] : "";
};

const LiveCall = ({ from, to, timestamp }: LiveCallProps) => {
  const { toast } = useToast();
  const { spy, extensionState } = useSip();
  const { setWebrtcOpen } = useAppStore();

  // Convert timestamp to seconds from now
  const startTime = Math.floor(
    Math.floor((Date.now() - new Date(timestamp * 1000).getTime()) / 1000)
  );

  const handleSpy = (extension: string) => {
    setWebrtcOpen(true);
    if (extensionState !== "connected") {
      toast({
        title: "Error",
        description: "Please connect your extension first.",
        variant: "destructive",
      });
      return;
    }
    spy(extension.toString());
  };

  return (
    <div className="live-call p-4 border border-primary-200 bg-gradient-to-r from-primary-100/50 to-primary-200/50 rounded-lg hover:from-primary-100/70 hover:to-primary-200/70 hover:border-primary-300 transition-colors flex flex-col gap-2">
      <div className="from bg-white border p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <CallMade className="text-success-500 !text-lg" />
          <span className="text-xs font-medium">From</span>
        </div>
        <div className="text-sm font-semibold text-gray-800">{from}</div>
        {getExtensionNumber(from) && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => handleSpy(getExtensionNumber(from))}
            >
              Spy
            </Button>
          </div>
        )}
      </div>
      <div className="from bg-white border p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <CallReceived className="text-primary-500 !text-lg" />
          <span className="text-xs font-medium">To</span>
        </div>
        <div className="text-sm font-semibold text-gray-800">{to}</div>
        {getExtensionNumber(to) && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => handleSpy(getExtensionNumber(to))}
            >
              Spy
            </Button>
          </div>
        )}
      </div>
      <hr />
      <div className="flex justify-between gap-1">
        <p className="text-xs text-gray-500">Duration</p>
        <div className="duration flex items-center gap-1">
          <span className="block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-xs text-green-500">
            <Timer startingTime={startTime} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveCall;
