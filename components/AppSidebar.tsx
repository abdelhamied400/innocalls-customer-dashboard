import Sidebar from "@/components/ui/Sidebar";
import SidebarHeader from "@/components/ui/SidebarHeader";
import SidebarItem from "@/components/ui/SidebarItem";
import SidebarCollapsibleItem from "@/components/ui/SidebarCollapsibleItem";

import DashboardCustomize from "@mui/icons-material/DashboardCustomize";
import RingVolume from "@mui/icons-material/RingVolume";
import Settings from "@mui/icons-material/Settings";
import Users from "@mui/icons-material/SupervisedUserCircle";
import Timeline from "@mui/icons-material/Timeline";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import DataUsage from "@mui/icons-material/DataUsage";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Code from "@mui/icons-material/Code";
import Apps from "@mui/icons-material/Apps";
import Monitor from "@mui/icons-material/Monitor";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import CallMissedOutgoing from "@mui/icons-material/CallMissedOutgoing";
import PersonSearch from "@mui/icons-material/PersonSearch";
import History from "@mui/icons-material/History";
import Quiz from "@mui/icons-material/Quiz";
import Hub from "@mui/icons-material/Hub";
import Assessment from "@mui/icons-material/Assessment";
import Campaign from "@mui/icons-material/Campaign";
import Phone from "@mui/icons-material/Phone";
import Key from "@mui/icons-material/Key";
import Api from "@mui/icons-material/Api";
import Support from "@mui/icons-material/Support";
import SmartToy from "@mui/icons-material/SmartToy";
import Image from "next/image";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { IntlT } from "@/types/next-intl";
import { ReactElement } from "react";
import { Layers } from "lucide-react";

// TypeScript interfaces for sidebar items
interface SidebarChildItem {
  title: string;
  href?: string;
  icon: ReactElement;
  isNew: boolean;
  isComingSoon: boolean;
  disabled?: boolean;
  roles?: string[];
}

interface SidebarItem {
  icon: ReactElement;
  title: string;
  href: string;
  isNew: boolean;
  isComingSoon: boolean;
  disabled?: boolean;
  roles?: string[];
  children?: SidebarChildItem[];
}

const sidebarItems = (t: IntlT, role: "user" | "agent"): SidebarItem[] => [
  {
    icon: <DashboardCustomize />,
    title: t("navigation.dashboard"),
    href: `/${role}`,
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <Monitor />,
    title: t("navigation.liveMonitoring"),
    href: `/${role}/live-monitoring`,
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <SmartToy />,
    title: "AI Voice Agents",
    href: `/${role}/ai-voice-agents`,
    roles: ["user"],
    isNew: false,
    isComingSoon: true,
    disabled: true,
  },
  {
    icon: <Timeline />,
    title: "Analytics",
    isNew: true,
    isComingSoon: false,
    href: `/${role}/analytics`,
    children: [
      {
        title: "Inbound",
        href: `/${role}/analytics/inbound`,
        icon: <ArrowDownward />,
        isNew: true,
        isComingSoon: false,
      },
      {
        title: "Outbound",
        href: `/${role}/analytics/outbound`,
        icon: <ArrowUpward />,
        isNew: true,
        isComingSoon: false,
      },
      {
        title: "Unanswered",
        href: `/${role}/analytics/unanswered`,
        icon: <CallMissedOutgoing />,
        isNew: true,
        isComingSoon: false,
      },
      // {
      //   title: "Queue Analytics",
      //   href: `/${role}/analytics/queue`,
      //   icon: <Layers />,
      //   isNew: true,
      //   isComingSoon: false,
      // },
      {
        title: "User Activity",
        href: `/${role}/analytics/user-activity`,
        icon: <PersonSearch />,
        isNew: true,
        isComingSoon: false,
      },
      {
        title: "Call History",
        href: `/${role}/call-reporting`,
        icon: <History />,
        isNew: true,
        isComingSoon: false,
      },
    ],
  },
  {
    icon: <Phone />,
    title: t("navigation.numbers"),
    href: `/${role}/numbers`,
    roles: ["user"],
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <Users />,
    title: t("navigation.users"),
    href: `/${role}/users`,
    roles: ["user"],
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <MonetizationOn />,
    title: t("navigation.billing"),
    href: `/${role}/billing`,
    roles: ["user"],
    isNew: true,
    isComingSoon: false,
  },
  {
    icon: <DataUsage />,
    title: t("navigation.usage"),
    href: `/${role}/usage`,
    roles: ["user"],
    isNew: true,
    isComingSoon: false,
  },

  {
    icon: <Apps />,
    title: "Apps",
    isNew: false,
    isComingSoon: true,
    roles: ["user"],
    href: `/${role}/apps`,
    children: [
      {
        title: t("navigation.autoDialer"),
        href: `/${role}/auto-dialer`,
        icon: <RingVolume />,
        isNew: false,
        isComingSoon: true,
        disabled: false,
      },
      {
        title: "Survey Campaigns",
        href: `/${role}/survey`,
        icon: <Quiz />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
      {
        title: "In Call Survey",
        href: `/${role}/analytics/in-call-survey`,
        icon: <Assessment />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
      {
        title: "Call Bridge",
        href: `/${role}/analytics/call-bridge`,
        icon: <Hub />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
      {
        title: "Order Confirmation",
        href: `/${role}/apps/order-confirmation`,
        icon: <ShoppingCart />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
      {
        title: "Call Campaign",
        href: `/${role}/apps/call-campaign`,
        icon: <Campaign />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
    ],
  },
  {
    icon: <Code />,
    title: t("navigation.developersTab"),
    isNew: false,
    isComingSoon: true,
    roles: ["user"],
    href: `/${role}/developers`,
    children: [
      {
        title: "Webcall",
        href: `/${role}/developers/webcall`,
        icon: <Phone />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
      {
        title: "Zendesk Credentials",
        href: `/${role}/developers/zendesk-credentials`,
        icon: <Support />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
      {
        title: "WebRTC Credentials",
        href: `/${role}/developers/webrtc-credentials`,
        icon: <Key />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
      {
        title: "API Credentials",
        href: `/${role}/developers/api-credentials`,
        icon: <Api />,
        isNew: false,
        isComingSoon: true,
        disabled: true,
      },
    ],
  },
  {
    icon: <Settings />,
    title: t("navigation.settings"),
    href: `/${role}/settings`,
    disabled: true,
    roles: ["user"],
    isNew: false,
    isComingSoon: true,
  },
];

const getVisibleItems = (role: "user" | "agent" = "user"): SidebarItem[] => {
  const t = useTranslations("sidebar");
  return sidebarItems(t, role).filter((item) => {
    if (!item.roles) return true; // Public or shared item
    return item.roles.includes(role as string);
  });
};

const AppSidebar = () => {
  const t = useTranslations("sidebar");
  const { data: session } = useSession();
  const role = session?.user?.role;

  const visibleItems = getVisibleItems(role);

  const renderItems = (
    items: (SidebarItem | SidebarChildItem)[] = visibleItems,
    parentKey = ""
  ) => {
    return items.map((item) => {
      if ("children" in item && item.children && item.children.length > 0) {
        return (
          <SidebarCollapsibleItem
            key={parentKey + item.title}
            icon={item.icon}
            title={item.title}
            isNew={item.isNew}
            isComingSoon={item.isComingSoon}
            href={item.href}
          >
            {renderItems(item.children, parentKey + item.title + "-")}
          </SidebarCollapsibleItem>
        );
      }
      return (
        <SidebarItem
          key={parentKey + (item.href || item.title)}
          icon={item.icon}
          title={item.title}
          href={item.href ?? "#"}
          disabled={item.disabled}
          isNew={item.isNew}
          isComingSoon={item.isComingSoon}
        />
      );
    });
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <div className="flex flex-col gap-2 p-4 overflow-y-auto">
        {renderItems()}

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
