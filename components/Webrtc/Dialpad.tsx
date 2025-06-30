import Digits from "./Shared/Digits";
import DialpadActions from "./Dialpad/DialpadActions";
import DialpadInput from "./Dialpad/DialpadInput";
import { useSip } from "@/providers/webrtc/SipProvider";
import { Button } from "../ui/button";

const Dialpad = () => {
  const { extensionState, reconnect } = useSip();
  return (
    <div className="dialpad">
      <div className="flex flex-col gap-4">
        <p>{extensionState}</p>
        <Button onClick={reconnect}>reload</Button>
        <DialpadInput />
        <Digits />
        <DialpadActions />
      </div>
    </div>
  );
};

export default Dialpad;
