import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallReportingTableHeaderProps {
  searchValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}

const CallReportingTableHeader = ({
  searchValue,
  onSearchChange,
  onExport,
}: CallReportingTableHeaderProps) => (
  <div className="users-table-head flex items-center justify-between p-4">
    <h2>Call Reporting</h2>
    <div className="actions flex items-center gap-2">
      <Field preIcon={<SearchIcon />}>
        <Input
          variant="field"
          placeholder="Search..."
          value={searchValue}
          onChange={onSearchChange}
          type="search"
        />
      </Field>
      <Button onClick={onExport}>Export</Button>
    </div>
  </div>
);

export default CallReportingTableHeader;
