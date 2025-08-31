import { AutoDialerCampaignCols } from "../columns";

import { Cell } from "@/types/cell";

type DurationTypeCellProps = Cell<AutoDialerCampaignCols>;
const DurationTypeCell = ({ cell, row }: DurationTypeCellProps) => {
  return (
    <span className="flex items-center gap-2 capitalize">
      {row.original.durationType.replace("-", " ")}
    </span>
  );
};

export default DurationTypeCell;
