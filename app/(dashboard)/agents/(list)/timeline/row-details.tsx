import { Row } from "@tanstack/react-table";
import { AgentTimeline } from "./columns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PersonIcon from "@mui/icons-material/Person";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useTranslations } from "@/providers/TranslationProvider";
import { fromUnixTime } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

type RowDetailsProps = {
  row: Row<AgentTimeline>;
};

const RowDetails = ({ row }: RowDetailsProps) => {
  const t = useTranslations("users.timeline.table");
  const activities = row.original.activities;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!activities || activities.length === 0) {
    return (
      <div className="mt-2 text-center text-gray-400 py-4">{t("noData")}</div>
    );
  }

  // Icon mapping for activity type
  const iconProps = { style: { fontSize: 24, color: "#fff" } };
  const activityIcon = (type: string) => {
    switch (type) {
      case "ready_accept_call":
        return <CheckCircleIcon {...iconProps} />;
      case "break_started":
        return <PauseCircleIcon {...iconProps} />;
      case "break_ended":
        return <CheckCircleIcon {...iconProps} />;
      case "dialpad_logged_out":
      case "portal_logged_out":
        return <LogoutIcon {...iconProps} />;
      case "connected_not_ready":
        return <PhoneMissedIcon {...iconProps} />;
      case "logged_in":
        return <PersonIcon {...iconProps} />;
      case "logged_out":
        return <LogoutIcon {...iconProps} />;
      default:
        return <RadioButtonUncheckedIcon {...iconProps} />;
    }
  };

  //CHECK THIS
  const convertToTimeOnly = (timestamp: number | string, timezone: string) => {
    if (!timestamp) return "";

    try {
      const timestampNum =
        typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;

      // convert unix -> Date
      const date = fromUnixTime(timestampNum);

      // format in specific timezone
      return formatInTimeZone(date, timezone, "HH:mm:ss");
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="relative flex flex-col gap-8 py-4">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200" />
      {activities.map((activity, idx) => (
        <div
          key={activity.timestamp + idx}
          className="relative flex items-start gap-4"
        >
          {/* Timeline dot and icon */}
          <div className="flex flex-col items-center">
            <div
              className={
                "z-10 rounded-full p-2 shadow flex items-center justify-center " +
                (activity.type === "ready_accept_call"
                  ? "bg-green-500"
                  : activity.type === "break_started"
                  ? "bg-yellow-500"
                  : activity.type === "break_ended"
                  ? "bg-blue-500"
                  : activity.type === "dialpad_logged_out" ||
                    activity.type === "portal_logged_out"
                  ? "bg-red-500"
                  : activity.type === "connected_not_ready"
                  ? "bg-orange-500"
                  : activity.type === "logged_in"
                  ? "bg-blue-700"
                  : activity.type === "logged_out"
                  ? "bg-gray-500"
                  : "bg-gray-400")
              }
            >
              {activityIcon(activity.type)}
            </div>
            {/* Connector line for all but last */}
            {idx < activities.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
            )}
          </div>
          {/* Activity details */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">
              {convertToTimeOnly(activity.unixTimestamp, timezone)}
            </span>
            <span className="font-medium text-base">
              {t(`activity.type.${activity.type}`)}
            </span>
            {activity.subType && (
              <span className="text-sm text-gray-600">
                {t(
                  `activity.subType.${activity.subType.toLocaleLowerCase()}`
                ) !== `activity.subType.${activity.subType.toLocaleLowerCase()}`
                  ? t(
                      `activity.subType.${activity.subType.toLocaleLowerCase()}`
                    )
                  : activity.subType}
              </span>
            )}
            {activity.eventType && (
              <span className="text-xs text-gray-400">
                {t(`activity.eventType.${activity.eventType}`)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RowDetails;
