import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { userStatuses } from "@/constants/user";
import { useTranslations } from "next-intl";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";

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
    <FilterBar
      onClear={() => {
        table.resetColumnFilters();
        table.setSorting([]);
        setStatus([]);
      }}
    >
      <FilterBox
        triggerLabel={t("status")}
        label={t("selectFromList")}
        onReset={() => {
          statusColumn?.setFilterValue("");
          setStatus([]);
        }}
        onApply={() => {
          statusColumn?.setFilterValue(status.join(","));
        }}
        numberOfFilters={status.length}
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
      </FilterBox>
    </FilterBar>
  );
};

export default UsersTableFilters;
