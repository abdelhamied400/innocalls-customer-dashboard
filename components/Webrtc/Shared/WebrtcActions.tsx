import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Contacts as ContactsIcon,
  FormatListNumbered,
  MoreHoriz,
  SubdirectoryArrowLeft,
} from "@mui/icons-material";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import CallLog from "../CallLog";
import { useSip } from "@/providers/webrtc/SipProvider";
import { Contacts, ContactsProviders } from "../Contacts";
import { useSession } from "next-auth/react";

const WebrtcActions = () => {
  const { logout } = useSip();
  const { data: session } = useSession();

  const handleLogout = () => {
    // Implement logout functionality here
    logout();
    console.log("Logout clicked");
  };

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex justify-between items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="unstyled" className="text-primary-500">
              <ContactsIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0">
            <ContactsProviders>
              <Contacts />
            </ContactsProviders>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost-primary"
              className="rounded-full"
            >
              <MoreHoriz />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem asChild>
              <Popover>
                <PopoverTrigger className="flex items-center gap-2 p-2 text-sm [&_svg]:size-5 hover:bg-gray-100 w-full">
                  <FormatListNumbered /> Call Log
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <CallLog />
                </PopoverContent>
              </Popover>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {session?.user.userType === "user" && (
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 text-sm [&_svg]:size-5 hover:bg-gray-100"
              >
                <SubdirectoryArrowLeft />
                Logout
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default WebrtcActions;
