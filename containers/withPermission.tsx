"use client";
import { useSession } from "next-auth/react";
import React from "react";
import FullPageError from "./FullPageError";
import { useTranslations } from "@/providers/TranslationProvider";

type userPermission =
  | "fullAccessNumbers"
  | "completeControlBilling"
  | "fullAccessUsageAnalytics"
  | "fullAccessOrderConfirmationCampaigns"
  | "fullAccessCallCampaigns"
  | "completeControlDeveloperTools"
  | "completeControlTicketing"
  | "fullAccessAutoDialerCampaigns"
  | "webrtcAccess"
  | "agentsAccessControl"
  | "fullAccessSurvey"
  | "fullAccessConferenceBridge";

function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: userPermission
) {
  return function ComponentWithPermission(props: P) {
    const { data: session, status } = useSession();
    const t = useTranslations("common");
    const user = session?.user;

    if (user && !user[requiredPermission] && status === "authenticated") {
      return (
        <FullPageError
          status={403}
          title={t("errors.403.title")}
          message={t("errors.403.message")}
        />
      );
    }

    // If the user has the required permission, render the wrapped component
    return <WrappedComponent {...(props as P)} />;
  };
}

export default withPermission;
