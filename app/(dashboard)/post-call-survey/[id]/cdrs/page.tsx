"use client";

import withActiveOrganization from "@/containers/withActiveOrganization";
import PostCallSurveyCdrsTable from "./table";

const PostCallSurveyCdrs = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
        <PostCallSurveyCdrsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(PostCallSurveyCdrs);
