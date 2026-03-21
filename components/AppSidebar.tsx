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
import SupportAgent from "@mui/icons-material/SupportAgent";
import Cloud from "@mui/icons-material/Cloud";
import SmartToy from "@mui/icons-material/SmartToy";
import Image from "next/image";
import { Button } from "./ui/button";
import { useTranslations } from "@/providers/TranslationProvider";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/auth.slice";
import useAuth from "@/hooks/useAuth";

const AppSidebar = () => {
  const t = useTranslations("sidebar");
  const { data: session } = useSession();
  const { data: auth } = useAuth();
  const { Organization } = useAuthStore();
  const isPending = Organization?.status === "pending";

  return (
    <Sidebar>
      <SidebarHeader />
      <div className="flex flex-col gap-2 p-4 overflow-y-auto">
        <SidebarItem
          icon={<DashboardCustomize />}
          title={t("navigation.dashboard")}
          href={`/`}
          disabled={isPending}
          isNew={true}
          isComingSoon={false}
        />
        {session?.userType === "user" &&
          Organization?.hasTenant &&
          auth?.user?.agentsAccessControl && (
            <SidebarItem
              icon={<Monitor />}
              title={t("navigation.liveMonitoring")}
              href={`/live-monitoring`}
              disabled={isPending}
              isNew={true}
              isComingSoon={false}
            />
          )}
        {session?.userType === "user" && (
          <SidebarItem
            icon={<SmartToy />}
            title={t("navigation.aiVoiceAgents")}
            href={`/ai-voice-agents`}
            disabled={true}
            isNew={false}
            isComingSoon={true}
          />
        )}

        {session?.userType === "user" && Organization?.hasTenant && (
          <SidebarItem
            icon={<Timeline />}
            title={t("navigation.analytics")}
            href={`/analytics`}
            disabled={isPending}
            isNew={true}
            isComingSoon={false}
          />
        )}

        {session?.userType === "user" && Organization?.hasTenant && (
          <SidebarItem
            icon={<Assessment />}
            title={t("navigation.reports")}
            href={`/reports`}
            disabled={true}
            isNew={false}
            isComingSoon={true}
          />
        )}

        {session?.userType === "agent" && (
          <SidebarItem
            icon={<PersonSearch />}
            title={t("navigation.activityAnalysis")}
            href={`/analytics/activity-reports`}
            disabled={isPending}
            isNew={true}
            isComingSoon={false}
          />
        )}

        {session?.userType === "agent" && Organization?.hasTenant && (
          <SidebarItem
            icon={<Timeline />}
            title={t("navigation.callHistory")}
            href={`/call-reporting`}
            disabled={isPending}
            isNew={true}
            isComingSoon={false}
          />
        )}

        {session?.userType === "agent" && (
          <SidebarCollapsibleItem
            icon={<Apps />}
            title={t("navigation.apps")}
            isNew={false}
            isComingSoon={true}
            href={`/apps`}
          >
            <SidebarItem
              icon={<RingVolume />}
              title={t("navigation.autoDialer")}
              href={`/auto-dialer`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
          </SidebarCollapsibleItem>
        )}

        {session?.userType === "user" && auth?.user?.fullAccessNumbers && (
          <SidebarItem
            icon={<Phone />}
            title={t("navigation.numbers")}
            href={`/numbers`}
            disabled={isPending}
            isNew={true}
            isComingSoon={false}
          />
        )}

        {session?.userType === "user" &&
          Organization?.hasTenant &&
          auth?.user?.agentsAccessControl && (
            <SidebarItem
              icon={<Users />}
              title={t("navigation.users")}
              href={`/agents`}
              disabled={isPending}
              isNew={true}
              isComingSoon={false}
            />
          )}

        {session?.userType === "user" && auth?.user?.completeControlBilling && (
          <SidebarItem
            icon={<MonetizationOn />}
            title={t("navigation.billing")}
            href={`/billing`}
            disabled={false}
            isNew={true}
            isComingSoon={false}
          />
        )}

        {session?.userType === "user" &&
          auth?.user?.fullAccessUsageAnalytics && (
            <SidebarItem
              icon={<DataUsage />}
              title={t("navigation.usage")}
              href={`/usage`}
              disabled={isPending}
              isNew={true}
              isComingSoon={false}
            />
          )}

        {session?.userType === "user" && (
          <SidebarCollapsibleItem
            icon={<Apps />}
            title={t("navigation.apps")}
            isNew={false}
            isComingSoon={true}
            href={`/apps`}
          >
            {auth?.user?.fullAccessAutoDialerCampaigns && (
              <SidebarItem
                icon={<RingVolume />}
                title={t("navigation.autoDialer")}
                href={`/auto-dialer`}
                disabled={true}
                isNew={false}
                isComingSoon={true}
              />
            )}
            <SidebarItem
              icon={<Quiz />}
              title={t("navigation.surveyCampaigns")}
              href={`/survey`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<Assessment />}
              title={t("navigation.inCallSurvey")}
              href={`/analytics/in-call-survey`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<Hub />}
              title={t("navigation.callBridge")}
              href={`/analytics/call-bridge`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<ShoppingCart />}
              title={t("navigation.orderConfirmation")}
              href={`/apps/order-confirmation`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<Campaign />}
              title={t("navigation.callCampaign")}
              href={`/apps/call-campaign`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
          </SidebarCollapsibleItem>
        )}
        {session?.userType === "user" &&
          auth?.user?.completeControlDeveloperTools && (
          <SidebarCollapsibleItem
            icon={<Code />}
            title={t("navigation.developersTab")}
            isNew={false}
            isComingSoon={true}
            href={`/developers`}
          >
            <SidebarItem
              icon={<Phone />}
              title={t("navigation.webcall")}
              href={`/developers/webcall`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<Support />}
              title={t("navigation.zendeskCredentials")}
              href={`/developers/zendesk-credentials`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<Key />}
              title={t("navigation.webrtcCredentials")}
              href={`/developers/webrtc-credentials`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<Api />}
              title={t("navigation.apiCredentials")}
              href={`/developers/api-credentials`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<SupportAgent />}
              title={t("navigation.freshdeskCredentials")}
              href={`/developers/freshdesk-credentials`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
            <SidebarItem
              icon={<Cloud />}
              title={t("navigation.zohoCredentials")}
              href={`/developers/zoho-credentials`}
              disabled={true}
              isNew={false}
              isComingSoon={true}
            />
          </SidebarCollapsibleItem>
        )}
        {session?.userType === "user" && (
          <SidebarItem
            icon={<Settings />}
            title={t("navigation.settings")}
            href={`/settings`}
            disabled={isPending}
            isNew={true}
            isComingSoon={false}
          />
        )}

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
