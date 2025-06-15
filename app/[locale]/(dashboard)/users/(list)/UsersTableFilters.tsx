import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon } from "lucide-react";
import FilterDialog from "@/components/FilterDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { userStatuses } from "@/constants/user";
import { Clear } from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface UsersTableFiltersProps {
  status: string[];
  setStatus: (status: string[]) => void;
  statusColumn: any;
  table: any;
}

const UsersTableFilters = ({
  status,
  setStatus,
  statusColumn,
  table,
}: UsersTableFiltersProps) => {
  const t = useTranslations("users.list.filters");
  return (
    <div className="flex justify-between items-center p-3 border-t table-filters">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="filter" size="filter">
              {t("status")}
              {status.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-neutral-500 px-1.5 rounded-md text-white"
                >
                  {status.length}
                </Badge>
              )}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <FilterDialog
              title={t("selectFromList")}
              onReset={() => {
                statusColumn?.setFilterValue("");
                setStatus([]);
              }}
              onApply={() => {
                statusColumn?.setFilterValue(status.join(","));
              }}
            >
              <RadioGroup
                defaultValue=""
                onValueChange={(value: string) => {
                  if (value === "") {
                    setStatus([]);
                  } else {
                    setStatus(value.split(","));
                  }
                }}
                value={status.length === 1 ? status[0] : ""}
              >
                {userStatuses.map((s) => (
                  <div className="flex items-center space-x-2" key={s.value}>
                    <RadioGroupItem value={s.value} id={s.value} />
                    <Label htmlFor={s.value}>{s.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FilterDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        onClick={() => {
          table.resetColumnFilters();
          table.setSorting([]);
          setStatus([]);
        }}
        variant="ghost"
      >
        <Clear /> {t("clear")}
      </Button>
    </div>
  );
};

export default UsersTableFilters;
