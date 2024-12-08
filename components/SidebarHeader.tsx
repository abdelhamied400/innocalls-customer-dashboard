import { SidebarClose } from "lucide-react";
import { Button } from "./ui/button";

const SidebarHeader = () => {
  return (
    <div className="sidebar-header">
      <div className="flex justify-between items-center gap-8 p-4 border-b-2">
        <h1 className="">Innocalls</h1>
        <Button variant="ghost" size="icon">
          <SidebarClose />
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
