import { AutoDialerCampaignCols } from "../columns";

import { Cell } from "@/types/cell";

type DurationTypeCellProps = Cell<AutoDialerCampaignCols>;
const DurationTypeCell = ({ cell }: DurationTypeCellProps) => {
  return <span className="flex items-center gap-2">{cell.renderValue()}</span>;
};

export default DurationTypeCell;
