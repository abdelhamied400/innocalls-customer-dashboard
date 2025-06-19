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
import { useTranslations } from "next-intl";

const AppSidebar = () => {

    const t = useTranslations("sidebar");
  
  return (
    <Sidebar>
      <SidebarHeader />
      <div className="flex flex-col gap-2 p-4 overflow-y-auto">
        <SidebarItem icon={<DashboardCustomize />} title={t("navigation.dashboard")} href="/" />
        <SidebarItem icon={<Phone />} title={t("navigation.numbers")} href="/numbers" />
        <SidebarItem icon={<Users />} title={t("navigation.users")} href="/users" />
        <SidebarItem
          icon={<Timeline />}
          title={t("navigation.callReporting")}
          href="/call-reporting"
        />
        <SidebarItem
          icon={<MonetizationOn />}
          title={t("navigation.billing")}
          href="/billing"
        />
        <SidebarItem icon={<DataUsage />} title={t("navigation.usage")} href="/usage" />
        <SidebarItem
          disabled
          icon={<ShoppingCart />}
          title={t("navigation.orderConfirmation")}
          href="/order-confirmation"
        />
        <SidebarItem
          icon={<RingVolume />}
          title={t("navigation.autoDialer")}
          href="/auto-dialer/active"
        />
        <SidebarItem
          disabled
          icon={<Code />}
          title={t("navigation.developersTab")}
          href="/developers-tab"
        />
        <SidebarItem
          disabled
          icon={<Settings />}
          title={t("navigation.settings")}
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
          <Button size="lg">{t("support.innoSupport")}</Button>
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
