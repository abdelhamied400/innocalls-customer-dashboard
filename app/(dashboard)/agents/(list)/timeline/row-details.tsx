import { Row } from "@tanstack/react-table";
import { AgentTimeline } from "./columns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PersonIcon from "@mui/icons-material/Person";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useTranslations } from "@/providers/TranslationProvider";

type RowDetailsProps = {
  row: Row<AgentTimeline>;
};

const RowDetails = ({ row }: RowDetailsProps) => {
  const t = useTranslations("users.timeline.table.details");
  const activities = row.original.activities;

  if (!activities || activities.length === 0) {
    return (
      <div className="mt-2 text-center text-gray-400 py-4">
        {t("noCallStats")}
      </div>
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
            <span className="text-xs text-gray-500">{activity.timestamp}</span>
            <span className="font-medium text-base">
              {activity.type.replace(/_/g, " ").toLowerCase()}
            </span>
            {activity.subType && (
              <span className="text-sm text-gray-600">{activity.subType}</span>
            )}
            {activity.eventType && (
              <span className="text-xs text-gray-400">
                {activity.eventType}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RowDetails;
