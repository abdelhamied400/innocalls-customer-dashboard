import { CallMade, CallReceived } from "@mui/icons-material";

type CallDirectionProps = {
  direction?: "incoming" | "outgoing";
};
const CallDirection = ({ direction }: CallDirectionProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {direction === "incoming" && (
        <div className="flex items-center gap-1 text-success-500">
          <CallReceived />
          Incoming Call
        </div>
      )}

      {direction === "outgoing" && (
        <div className="flex items-center gap-1 text-primary-500">
          <CallMade />
          Outgoing Call
        </div>
      )}
    </div>
  );
};

export default CallDirection;
