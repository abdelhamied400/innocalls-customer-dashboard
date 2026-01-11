import { Button } from "@/components/ui/button";
import { CallLog } from "@/lib/call-log";
import {
  Call,
  CallMade,
  CallReceived,
  PhoneMissed,
  Timer,
  CalendarMonth,
  CallMissed,
} from "@mui/icons-material";
import { format, parse } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations, useLocale } from "@/providers/TranslationProvider";
import { ar, enUS } from "date-fns/locale";

type CallLogRowProps = Omit<CallLog, "calls"> & {
  onCall?: () => void;
};

const CallLogRow = ({ number, time, stats, name, onCall }: CallLogRowProps) => {
  const t = useTranslations("webrtc.callLog");
  const locale = useLocale();

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
    <div className="call-log-row bg-gray-100 flex justify-between items-center p-2 rounded-lg hover:bg-gray-200 transition-colors text-sm [&_svg]:size-5">
      <div className="details flex flex-col gap-2">
        <h4 className="text-start">
          {"\u200E" + number} {!name || name === number ? "" : `- (${name})`}
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

        <TooltipProvider>
          <div className="stats flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <div className="stat flex items-center gap-2">
                  <CallMade className="text-success" />
                  <p>{stats.outgoing}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("status.outgoing")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div className="stat flex items-center gap-2">
                  <CallReceived className="text-primary" />
                  <p>{stats.incoming}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("status.incoming")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div className="stat flex items-center gap-2">
                  <PhoneMissed className="text-destructive" />
                  <p>{stats.missed}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("status.missed")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div className="stat flex items-center gap-2">
                  <CallMissed className="text-destructive" />
                  <p>{stats.rejected}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("status.rejected")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div className="actions">
        <Button
          size="icon"
          variant="ghost-primary"
          className="rounded-full"
          onClick={onCall}
        >
          <Call />
        </Button>
      </div>
    </div>
  );
};

export default CallLogRow;
