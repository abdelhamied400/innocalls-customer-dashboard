"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultLocale, localesArray } from "@/i18n/config";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import LanguageIcon from "@mui/icons-material/Language";
import { Link, usePathname } from "@/i18n/routing";

const LocaleSwitcher = () => {
  const localeSlug = useLocale();
  const pathname = usePathname();
  const currentLocale = useMemo(
    () => localesArray.find((locale) => locale.slug === localeSlug),
    [localeSlug]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <span className="hidden md:block">{currentLocale?.name}</span>
          <LanguageIcon className="" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {localesArray.map((locale) => (
          <Link
            key={locale.slug}
            href={pathname}
            locale={locale.slug}
            passHref
            replace
          >
            <DropdownMenuItem
              className={cn(
                "cursor-pointer",
                locale.slug === localeSlug && "font-semibold bg-neutral-100"
              )}
            >
              {locale.name}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
