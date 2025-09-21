import { Button } from "@/components/ui/button";
import { useSip } from "@/providers/webrtc/SipProvider";
import { Backspace, Logout, Phone } from "@mui/icons-material";

const DialpadActions = () => {
  const { call, setNumber, number } = useSip();

  const handleCall = () => {
    // Implement call functionality here
    call();
  };

  const handleBackspace = () => {
    setNumber(number.slice(0, -1));
  };

  const handleLongBackspace = () => {
    setNumber("");
  };

  return (
    <div className="dialpad-actions grid grid-cols-3 gap-5 place-items-center">
      <div className=""></div>
      <Button
        size="icon"
        className="[&_svg]:size-8 size-12 rounded-full w-16 h-16"
        variant="success"
        onClick={handleCall}
      >
        <Phone />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full w-16 h-16"
        onClick={handleBackspace}
        onLongPress={handleLongBackspace}
      >
        <Backspace />
      </Button>
    </div>
  );
};

export default DialpadActions;
