"use client";
import { useTranslations } from "@/providers/TranslationProvider";
import React from "react";
import FullPageError from "./FullPageError";
import useAuthStore from "@/store/auth.slice";
import { useSession } from "next-auth/react";

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
