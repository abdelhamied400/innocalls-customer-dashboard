"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localesArray } from "@/i18n/config";
import {
  useLocale,
  useTranslationContext,
} from "@/providers/TranslationProvider";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import LanguageIcon from "@mui/icons-material/Language";

const LocaleSwitcher = () => {
  const localeSlug = useLocale();
  const { setLocale } = useTranslationContext();
  const currentLocale = useMemo(
    () => localesArray.find((locale) => locale.slug === localeSlug),
    [localeSlug]
  );

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as any);
  };

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
          <DropdownMenuItem
            key={locale.slug}
            onClick={() => handleLocaleChange(locale.slug)}
            className={cn(
              "cursor-pointer",
              locale.slug === localeSlug && "font-semibold bg-neutral-100"
            )}
          >
            {locale.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
