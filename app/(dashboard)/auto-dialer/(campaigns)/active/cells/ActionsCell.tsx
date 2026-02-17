import { AutoDialerCampaignCols } from "../columns";
import { Cell } from "@/types/cell";
import CampaignActions from "../../../shared/CampaignActions";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => (
  <CampaignActions campaign={row.original} />
);

export default ActionsCell;
