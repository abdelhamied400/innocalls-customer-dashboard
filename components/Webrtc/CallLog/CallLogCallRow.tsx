import { Badge, BadgeVariant } from "@/components/ui/badge";
import { CallLogCall } from "@/lib/call-log";
import { CalendarMonth, Timer } from "@mui/icons-material";
import { format, parse } from "date-fns";
import { useTranslations, useLocale } from "next-intl";
import { ar, enUS } from "date-fns/locale";

const badgeVariants: Record<CallLogCall["type"], BadgeVariant> = {
  incoming: "default",
  outgoing: "secondary",
  missed: "destructive",
  rejected: "warning",
};

type CallLogCallRowProps = CallLogCall & {};
const CallLogCallRow = ({ number, time, type, name }: CallLogCallRowProps) => {
  const t = useTranslations("webrtc.callLog");
  const locale = useLocale(); // Gets current locale (e.g., 'ar', 'en')

  const dateTime = parse(
    time.replace(/ (AM|PM)/, ""),
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  const getCurrentLocale = (locale: string) => {
    return locale === "ar" ? ar : enUS;
  };

  const dateFnsLocale = getCurrentLocale(locale);

  return (
    <div className="call-log-call-row bg-primary-50 flex justify-between items-center p-2 rounded-lg hover:bg-primary-100 transition-colors text-sm [&_svg]:size-5">
      <div className="details flex flex-col gap-2">
        <h4>
          {"\u200E" + number} {name ? `- (${name})` : ""}
        </h4>
        <div className="date-time flex items-center gap-2">
          <div className="date flex items-center">
            <CalendarMonth />
            <p>
              {format(new Date(dateTime), "dd/MM/yyyy", {
                locale: dateFnsLocale,
              })}
            </p>
          </div>
          <div className="date flex items-center">
            <Timer />
            <p>
              {format(new Date(dateTime), "hh:mm a", { locale: dateFnsLocale })}
            </p>
          </div>
        </div>
        <div className="type flex items-center gap-2">
          <Badge variant={badgeVariants[type]}>{t(`type.${type}`)}</Badge>
        </div>
      </div>
    </div>
  );
};

export default CallLogCallRow;
