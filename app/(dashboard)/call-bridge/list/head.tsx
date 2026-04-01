"use client";
import { buttonVariants } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import useDebounce from "@/hooks/use-debounce";

type CallBridgeHeadProps = {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

const CallBridgeHead = ({ filters, setFilters }: CallBridgeHeadProps) => {
  const t = useTranslations("callBridge");
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm === (filters.name || "")) return;
    setFilters((prev) => ({
      ...prev,
      name: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm, filters.name, setFilters]);

  return (
    <div className="table-head">
      <div className="flex justify-between items-center gap-4 p-3">
        <h3>{t("list.title")}</h3>
        <div className="flex items-center gap-4 actions">
          <Field preIcon={<Search className="text-muted-foreground" />}>
            <Input
              placeholder={t("list.search")}
              type="search"
              variant="field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Field>
          <Link
            className={cn(buttonVariants({ variant: "outline" }))}
            href="/call-bridge/calls"
          >
            {t("list.calls")}
          </Link>
          <Link className={cn(buttonVariants())} href="/call-bridge/create">
            {t("list.create")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallBridgeHead;
