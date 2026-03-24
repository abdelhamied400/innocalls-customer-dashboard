"use client";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "@/providers/TranslationProvider";
import React from "react";
import FullPageError from "./FullPageError";
import useAuthStore from "@/store/auth.slice";
import { useSession } from "@/hooks/useSession";

const hasTenant = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => {
    const { Organization } = useAuthStore();
    const { data: session, status } = useSession();
    const t = useTranslations("common");

    if (
      session?.user &&
      status === "authenticated" &&
      !Organization?.hasTenant
    ) {
      Sentry.addBreadcrumb({
        category: "auth.tenant",
        message: "Tenant check failed — no tenant assigned to organization",
        level: "warning",
      });
      return (
        <FullPageError
          status={403}
          title={t("errors.403.title")}
          message={t("errors.403.message")}
        />
      );
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default hasTenant;
