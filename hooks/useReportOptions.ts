import { useMemo } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { REPORT_TYPE_VALUES } from "@/constants/reports";

export const useReportOptions = () => {
  const t = useTranslations("reports.reportTypes");

  const reportOptions = useMemo(
    () =>
      REPORT_TYPE_VALUES.map((value) => ({
        label: t(value),
        value,
      })),
    [t]
  );

  return reportOptions;
};

export default useReportOptions;
