import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/ui/table-skeleton";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";


const UsersLoading = () => {

    const t= useTranslations('users.monitor');
    const searchT = useTranslations('common.search');

  return (
    <div className="users-loading h-full">
      <div className="h-full flex flex-col">
        <div className="number-table-head flex items-center justify-between p-4">
          <h2>{t('title')}</h2>
          <div className="searchbar">
            <Field preIcon={<SearchIcon />}>
              <Input
                variant="field"
                placeholder={searchT("placeholder")}
                type="search"
                disabled
              />
            </Field>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TableSkeleton />
        </div>

        <div className="pagination mt-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersLoading;
