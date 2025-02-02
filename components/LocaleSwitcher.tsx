"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localesArray } from "@/i18n/config";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import LanguageIcon from "@mui/icons-material/Language";

const LocaleSwitcher = () => {
  const router = useRouter();
  const localeSlug = useLocale();
  const currentLocale = useMemo(
    () => localesArray.find((locale) => locale.slug === localeSlug),
    [localeSlug]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <span className="">{currentLocale?.name}</span>
          <LanguageIcon className="" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {localesArray.map((locale) => (
          <DropdownMenuItem
            key={locale.slug}
            className={cn(
              "cursor-pointer",
              locale.slug === localeSlug && "font-semibold bg-neutral-100"
            )}
            onClick={() => router.replace("/", { locale: locale.slug })}
          >
            {locale.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
