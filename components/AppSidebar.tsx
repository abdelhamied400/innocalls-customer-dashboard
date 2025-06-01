import Sidebar from "@/components/ui/Sidebar";
import SidebarHeader from "@/components/ui/SidebarHeader";
import SidebarItem from "@/components/ui/SidebarItem";

import DashboardCustomize from "@mui/icons-material/DashboardCustomize";
import Phone from "@mui/icons-material/Phone";
import RingVolume from "@mui/icons-material/RingVolume";
import Settings from "@mui/icons-material/Settings";
import Users from "@mui/icons-material/SupervisedUserCircle";
import Timeline from "@mui/icons-material/Timeline";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import DataUsage from "@mui/icons-material/DataUsage";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Code from "@mui/icons-material/Code";
import Image from "next/image";
import { Button } from "./ui/button";

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader />
      <div className="flex flex-col gap-2 p-4 overflow-y-auto">
        <SidebarItem icon={<DashboardCustomize />} title="Dashboard" href="/" />
        <SidebarItem icon={<Phone />} title="Numbers" href="/numbers" />
        <SidebarItem icon={<Users />} title="Users" href="/users" />
        <SidebarItem
          icon={<Timeline />}
          title="Call Reporting"
          href="/call-reporting"
        />
        <SidebarItem
          icon={<MonetizationOn />}
          title="Billing"
          href="/billing"
        />
        <SidebarItem icon={<DataUsage />} title="Usage" href="/usage" />
        <SidebarItem
          disabled
          icon={<ShoppingCart />}
          title="Order Confirmation"
          href="/order-confirmation"
        />
        <SidebarItem
          icon={<RingVolume />}
          title="Auto Dialer"
          href="/auto-dialer/active"
        />
        <SidebarItem
          disabled
          icon={<Code />}
          title="Developers Tab"
          href="/developers-tab"
        />
        <SidebarItem
          disabled
          icon={<Settings />}
          title="Settings"
          href="/settings"
        />
        <hr />
        <div className="py-2 flex flex-col gap-2">
          <Image
            src="/assets/images/robot.svg"
            alt="robot"
            width={100}
            height={200}
            className="mx-auto"
          />
          <Button size="lg">Inno Support</Button>
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
