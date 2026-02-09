"use client";

import CreateUserForm from "./form";
import withActiveOrganization from "@/containers/withActiveOrganization";

const CreateUser = () => {
  return (
    <div className="page" id="create-user">
      <CreateUserForm />
    </div>
  );
};

export default withActiveOrganization(CreateUser);
