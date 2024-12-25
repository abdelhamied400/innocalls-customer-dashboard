import AutoDialerFinishedTable from "./table";

type FinishedAutoDialerCampaignsProps = {};
const FinishedAutoDialerCampaigns = async () => {
  return (
    <div className="page" id="auto-dialer">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <div className="bg-white border rounded-xl">
          <AutoDialerFinishedTable />
        </div>
      </div>
    </div>
  );
};

export default FinishedAutoDialerCampaigns;
