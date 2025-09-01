import { LocaleSlug } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";
import { usePathname } from "next/navigation";

const useRouteWithLocale = () => {
  const pathname = usePathname();
  const locale = useLocale() as LocaleSlug;

  // Ensure locale is present and not already in the path
  const pathWithoutLocale = pathname.replace(/^\/[a-zA-Z-]+(?=\/|$)/, "");
  const routeWithLocale = `/${locale}${pathWithoutLocale}`;

  return routeWithLocale;
};

export default useRouteWithLocale;
