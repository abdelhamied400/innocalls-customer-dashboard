import useAuthStore from "@/store/auth.slice";
import { redirect } from "next/navigation";

const withActiveOrganization = (Component: React.ComponentType) => {
  return function WithActiveOrganization(props: any) {
    const { Organization } = useAuthStore();

    if (!Organization) {
      return null; // or a loading spinner
    }

    if (Organization.status === "pending") {
      return redirect("/billing/subscription");
    }

    return <Component {...props} />;
  };
};

export default withActiveOrganization;
