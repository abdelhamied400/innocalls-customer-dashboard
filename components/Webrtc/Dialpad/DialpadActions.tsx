import { Button } from "@/components/ui/button";
import { useSip } from "@/providers/webrtc/SipProvider";
import { Backspace, Logout, Phone } from "@mui/icons-material";

const DialpadActions = () => {
  const { call, logout, setNumber } = useSip();
  const handleLogout = () => {
    // Implement logout functionality here
    logout();
    console.log("Logout clicked");
  };

  const handleCall = () => {
    // Implement call functionality here
    console.log("Call clicked");
    call();
  };

  const backspace = () => {
    // Implement backspace functionality here
    console.log("Backspace clicked");
    setNumber((prev) => prev.slice(0, -1));
  };

  return (
    <div className="dialpad-actions grid grid-cols-3 gap-5 place-items-center">
      <Button
        size="icon"
        className="size-12 rounded-full w-16 h-16"
        variant="ghost-destructive"
        onClick={handleLogout}
      >
        <Logout />
      </Button>
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
        onClick={backspace}
      >
        <Backspace />
      </Button>
    </div>
  );
};

export default DialpadActions;
