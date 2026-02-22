import { useTranslations } from "@/providers/TranslationProvider";
import { AutoDialerCampaignCols } from "../columns";

import { Cell } from "@/types/cell";

type DurationTypeCellProps = Cell<AutoDialerCampaignCols>;
const DurationTypeCell = ({ cell }: DurationTypeCellProps) => {
  const t = useTranslations("autoDialer");
  return (
    <span className="flex items-center gap-2 capitalize">
      {t(`activeCampaigns.durationTypes.${cell.getValue()}`)}
    </span>
  );
};

export default DurationTypeCell;
