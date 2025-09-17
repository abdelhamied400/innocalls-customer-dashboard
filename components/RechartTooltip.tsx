import { defaultLocale, locales } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";
import { Tooltip, TooltipProps } from "recharts";

type RechartTooltipProps = TooltipProps<number, string | number>;
const RechartTooltip = (props: RechartTooltipProps) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];
  return <Tooltip contentStyle={{ direction: locale.dir }} {...props} />;
};

export default RechartTooltip;
