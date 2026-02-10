"use client";

import CreateTagForm from "./form";
import withActiveOrganization from "@/containers/withActiveOrganization";

const CreateTagPage = () => {
  return (
    <div className="page h-full" id="create-tag">
      <CreateTagForm />
    </div>
  );
};

export default withActiveOrganization(CreateTagPage);
