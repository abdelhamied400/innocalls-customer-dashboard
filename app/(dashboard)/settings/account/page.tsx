import OrganizationDetailsForm from "./organization-details-form";
import UpdatePasswordForm from "./update-password-form";

const AccountSettings = () => {
  return (
    <div className="page overflow-y-auto" id="account-settings">
      <div className="flex flex-col gap-2">
        <OrganizationDetailsForm />
        <UpdatePasswordForm />
      </div>
    </div>
  );
};

export default AccountSettings;
