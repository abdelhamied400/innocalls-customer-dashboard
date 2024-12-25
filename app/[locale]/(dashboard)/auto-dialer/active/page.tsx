import AutoDialerActiveTable from "./table";

type ActiveAutoDialerCampaignsProps = {};
const ActiveAutoDialerCampaigns = async () => {
  return (
    <div className="page" id="auto-dialer">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <div className="bg-white border rounded-xl">
          <AutoDialerActiveTable />
        </div>
      </div>
    </div>
  );
};

export default ActiveAutoDialerCampaigns;
