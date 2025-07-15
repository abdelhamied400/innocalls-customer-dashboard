import { CallMade, CallReceived } from "@mui/icons-material";

interface LiveCallProps {
  from: string;
  to: string;
  duration: string;
}

const LiveCall = ({ from, to, duration }: LiveCallProps) => {
  return (
    <div className="live-call p-4 border border-primary-200 bg-gradient-to-r from-primary-100/50 to-primary-200/50 rounded-lg hover:from-primary-100/70 hover:to-primary-200/70 hover:border-primary-300 transition-colors flex flex-col gap-2">
      <div className="from bg-white border p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <CallMade className="text-success-500 !text-lg" />
          <span className="text-xs font-medium">From</span>
        </div>
        <div className="text-sm font-semibold text-gray-800">{from}</div>
      </div>
      <div className="from bg-white border p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <CallReceived className="text-primary-500 !text-lg" />
          <span className="text-xs font-medium">To</span>
        </div>
        <div className="text-sm font-semibold text-gray-800">{to}</div>
      </div>
      <hr />
      <div className="flex justify-between gap-1">
        <p className="text-xs text-gray-500">Duration</p>
        <div className="duration flex items-center gap-1">
          <span className="block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-xs text-green-500">{duration}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveCall;
