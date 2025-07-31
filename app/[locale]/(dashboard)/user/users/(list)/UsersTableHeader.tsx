import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useAuthStore from "@/store/auth.slice";

interface UsersTableHeaderProps {
  searchValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UsersTableHeader = ({
  searchValue,
  onSearchChange,
}: UsersTableHeaderProps) => {
  const t = useTranslations("users.list");
  const commonT = useTranslations("common.search");
  const { Organization } = useAuthStore();

  return (
    <div className="users-table-head flex flex-wrap items-center justify-between p-4">
      <h2>{t("title")}</h2>
      <div className="actions flex flex-wrap items-center gap-2">
        <Field preIcon={<SearchIcon />}>
          <Input
            variant="field"
            placeholder={commonT("placeholder")}
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
        {Organization?.hasTenant && (
          <Link href="/users/create">
            <Button>{t("actions.create")}</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default UsersTableHeader;
