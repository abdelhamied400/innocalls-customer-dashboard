"use client";

import withActiveOrganization from "@/containers/withActiveOrganization";
import PostCallSurveyTable from "./table";

const PostCallSurveyPage = () => {
  return (
    <div className="bg-white rounded-xl p-4 h-full" id="post-call-survey">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <PostCallSurveyTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(PostCallSurveyPage);
