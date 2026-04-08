"use client";
import UncompletedTable from "./table";

const SurveyUncompletedPage = () => {
  return (
    <div className="page flex-1 overflow-hidden">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <UncompletedTable />
      </div>
    </div>
  );
};

export default SurveyUncompletedPage;
