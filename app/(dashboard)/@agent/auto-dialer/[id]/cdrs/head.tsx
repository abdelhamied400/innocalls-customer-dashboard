"use client";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/providers/TranslationProvider";
import { SearchIcon } from "lucide-react";

type CdrsHeadProps = {
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
};

const CdrsHead = ({ filters, setFilters }: CdrsHeadProps) => {
  const t = useTranslations("autoDialerAgent");
  const { table } = usePaginatedTable();

  const sanitizePhone = (value: string) => {
    return value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizePhone(e.target.value);
    setFilters({
      ...filters,
      phone: value || undefined,
    });
    table.setPageIndex(0);
  };

  return (
    <div className="table-head flex flex-wrap items-center justify-between p-3">
      <h3>{t("cdrsTitle")}</h3>
      <div className="actions flex items-center gap-2">
        <Field preIcon={<SearchIcon />}>
          <Input
            variant="field"
            placeholder={t("searchPhone")}
            inputMode="tel"
            value={filters.phone || ""}
            onChange={handleSearchChange}
            type="search"
          />
        </Field>
      </div>
    </div>
  );
};

export default CdrsHead;
