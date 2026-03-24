import * as Sentry from "@sentry/nextjs";
import useAuthStore from "@/store/auth.slice";
import { redirect } from "next/navigation";

const withActiveOrganization = (Component: React.ComponentType<any>) => {
  return function WithActiveOrganization(props: any) {
    const { Organization } = useAuthStore();

    if (!Organization) {
      return null; // or a loading spinner
    }

    if (Organization.status === "pending") {
      Sentry.addBreadcrumb({
        category: "auth.organization",
        message: "Organization is pending — redirecting to billing/subscription",
        level: "info",
      });
      return redirect("/billing/subscription");
    }

    return <Component {...props} />;
  };
};

export default withActiveOrganization;
