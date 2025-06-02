import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Link from "next/link";

interface UsersTableHeaderProps {
  searchValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UsersTableHeader = ({
  searchValue,
  onSearchChange,
}: UsersTableHeaderProps) => (
  <div className="users-table-head flex items-center justify-between p-4">
    <h2>Users List</h2>
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
      <CollapsibleTrigger asChild>
        <Toggle pressed={true} className="rounded-full">
          <FilterAltIcon />
        </Toggle>
      </CollapsibleTrigger>
      <Link href="/users/create">
        <Button>Create new user</Button>
      </Link>
    </div>
  </div>
);

export default UsersTableHeader;
