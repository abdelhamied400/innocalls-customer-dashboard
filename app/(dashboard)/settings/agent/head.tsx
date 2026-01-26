"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";

const BreakTypesTableHead = () => {
  const t = useTranslations("settings.agent.breaks");
  const tCommon = useTranslations("common");
  const { table } = usePaginatedTable();

  const handleSearchChange = (value: string) => {
    table.setGlobalFilter(value);
  };

  return (
    <div className="break-types-table-head flex flex-wrap items-center justify-between p-4">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={tCommon("search.placeholder")}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="ps-9 w-[200px]"
          />
        </div>
        <Button asChild>
          <Link href="/settings/agent/create-break">
            <Plus className="h-4 w-4" />
            {t("actions.create")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BreakTypesTableHead;
