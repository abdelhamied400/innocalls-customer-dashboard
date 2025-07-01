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
import { useSession } from "next-auth/react";
import { IntlT } from "@/types/next-intl";

const sidebarItems = (t: IntlT) => [
  {
    icon: <DashboardCustomize />,
    title: t("navigation.dashboard"),
    href: "/",
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <Phone />,
    title: t("navigation.numbers"),
    href: "/numbers",
    roles: ["user"],
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <Users />,
    title: t("navigation.users"),
    href: "/users",
    roles: ["user"],
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <Timeline />,
    title: t("navigation.callReporting"),
    href: "/call-reporting",
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <MonetizationOn />,
    title: t("navigation.billing"),
    href: "/billing",
    roles: ["user"],
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <DataUsage />,
    title: t("navigation.usage"),
    href: "/usage",
    roles: ["user"],
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <ShoppingCart />,
    title: t("navigation.orderConfirmation"),
    href: "/order-confirmation",
    disabled: true,
    roles: ["user"],
    isNew: false,
    isComingSoon: true,
  },
  {
    icon: <RingVolume />,
    title: t("navigation.autoDialer"),
    href: "/auto-dialer/active",
    isNew: false,
    isComingSoon: true,
    disabled: true,
  },
  {
    icon: <Code />,
    title: t("navigation.developersTab"),
    href: "/developers-tab",
    disabled: true,
    roles: ["user"],
    isNew: false,
    isComingSoon: true,
  },
  {
    icon: <Settings />,
    title: t("navigation.settings"),
    href: "/settings",
    disabled: true,
    roles: ["user"],
    isNew: false,
    isComingSoon: true,
  },
];

const getVisibleItems = (role?: "user" | "agent") => {
  const t = useTranslations("sidebar");
  return sidebarItems(t).filter((item) => {
    if (!item.roles) return true; // Public or shared item
    return item.roles.includes(role as string);
  });
};

const AppSidebar = () => {
  const t = useTranslations("sidebar");
  const { data: session } = useSession();
  const role = session?.user?.role;

  const visibleItems = getVisibleItems(role);

  return (
    <Sidebar>
      <SidebarHeader />
      <div className="flex flex-col gap-2 p-4 overflow-y-auto">
        {visibleItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            title={item.title}
            href={item.href}
            disabled={item.disabled}
            isNew={item.isNew}
            isComingSoon={item.isComingSoon}
          />
        ))}

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
