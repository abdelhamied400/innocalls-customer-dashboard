import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownCircleIcon } from "lucide-react";

const ProfileMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <span className="border-[3px] border-primary p-0.5 rounded-full w-14 h-14">
            <img
              src="https://randomuser.me/api/portraits/women/54.jpg"
              alt="avatar"
              className="rounded-full"
            />
          </span>
          <div className="flex flex-col">
            <p className="font-semibold text-lg">John Doe</p>
            <p className="text-neutral-400 text-sm">Admin</p>
          </div>

          <ChevronDownCircleIcon className="text-neutral-300" size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
