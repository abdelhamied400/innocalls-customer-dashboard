import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslations } from "@/providers/TranslationProvider";

const NoData = () => {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <InfoOutlinedIcon color="action" fontSize="large" />
      <span className="mt-2 text-gray-500 text-lg font-medium">
        {t("states.noData")}
      </span>
    </div>
  );
};

export default NoData;
