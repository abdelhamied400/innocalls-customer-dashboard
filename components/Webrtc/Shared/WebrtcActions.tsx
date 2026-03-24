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
import { useSession } from "@/hooks/useSession";
import { useTranslations } from "@/providers/TranslationProvider";

const WebrtcActions = () => {
  const t = useTranslations("webrtc.actions");

  const { logout } = useSip();
  const { data: session } = useSession();

  const handleLogout = () => {
    // Implement logout functionality here
    logout();
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
          <PopoverContent
            portalled={false}
            className="w-96 p-0 popover-content"
          >
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
                  <FormatListNumbered /> {t("callLog")}
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <CallLog />
                </PopoverContent>
              </Popover>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {session?.userType === "user" && (
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 text-sm [&_svg]:size-5 hover:bg-gray-100"
              >
                <SubdirectoryArrowLeft />
                {t("logout")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default WebrtcActions;
