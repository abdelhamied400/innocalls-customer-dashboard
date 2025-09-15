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

// TODO: ABDO. CHECK THIS 

const RowDetails = ({ row }: RowDetailsProps) => {
  const t = useTranslations("users.timeline.table");
  const activities = row.original.activities;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!activities || activities.length === 0) {
    return (
      <div className="px-4 py-3 bg-gray-50 text-center text-sm text-gray-500">
        {t("noData")}
      </div>
    );
  }

  const getActivityConfig = (type: string) => {
    const configs: any = {
      ready_accept_call: {
        icon: CheckCircleIcon,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      break_started: {
        icon: PauseCircleIcon,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      },
      break_ended: {
        icon: CheckCircleIcon,
        color: "text-blue-600",
        bg: "bg-blue-100",
      },
      dialpad_logged_out: {
        icon: LogoutIcon,
        color: "text-red-600",
        bg: "bg-red-100",
      },
      portal_logged_out: {
        icon: LogoutIcon,
        color: "text-red-600",
        bg: "bg-red-100",
      },
      connected_not_ready: {
        icon: PhoneMissedIcon,
        color: "text-orange-600",
        bg: "bg-orange-100",
      },
      logged_in: {
        icon: PersonIcon,
        color: "text-blue-700",
        bg: "bg-blue-100",
      },
      logged_out: {
        icon: LogoutIcon,
        color: "text-gray-600",
        bg: "bg-gray-100",
      },
    };

    return (
      configs[type] || {
        icon: RadioButtonUncheckedIcon,
        color: "text-gray-500",
        bg: "bg-gray-100",
      }
    );
  };

  const convertToTimeOnly = (timestamp: number | string, timezone: string) => {
    if (!timestamp) return "";
    try {
      const timestampNum =
        typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
      const date = fromUnixTime(timestampNum);
      return formatInTimeZone(date, timezone, "HH:mm:ss");
    } catch (error) {
      return "";
    }
  };

  const getSubTypeConfig = (subType: string) => {
    const subTypeConfigs: any = {
      meeting: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      training: {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
      },
      prayer: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      personal: {
        bg: "bg-pink-50",
        text: "text-pink-700",
        border: "border-pink-200",
      },
      lunch: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      },
      breakfast: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      coffee: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      general: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      },
    };

    // Fallback for unknown subTypes
    return (
      subTypeConfigs[subType.toLowerCase()] || {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
      }
    );
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="px-4 py-3">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-300" />

          {/* Compact timeline items */}
          <div className="space-y-2">
            {activities.map((activity, idx) => {
              const config = getActivityConfig(activity.type);
              const Icon = config.icon;

              return (
                <div
                  key={activity.timestamp + idx}
                  className="relative flex items-center gap-3 py-1"
                >
                  {/* Compact icon */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon style={{ fontSize: 16 }} />
                  </div>

                  {/* Compact content with better hierarchy */}
                  <div className="flex-1 min-w-0 flex items-center justify-between hover:bg-white hover:rounded-md hover:shadow-sm transition-colors duration-150 px-2 py-1 -mx-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-800 truncate">
                        {t(`activity.type.${activity.type}`)}
                      </div>

                      {/* Enhanced sub-details */}
                      {(activity.subType || activity.eventType) && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          {activity.subType &&
                            (() => {
                              const subTypeConfig = getSubTypeConfig(
                                activity.subType
                              );
                              return (
                                <span
                                  className={`${subTypeConfig.bg} ${subTypeConfig.text} px-2 py-0.5 rounded-full border ${subTypeConfig.border} font-medium`}
                                >
                                  {t(
                                    `activity.subType.${activity.subType.toLocaleLowerCase()}`
                                  ) !==
                                  `activity.subType.${activity.subType.toLocaleLowerCase()}`
                                    ? t(
                                        `activity.subType.${activity.subType.toLocaleLowerCase()}`
                                      )
                                    : activity.subType}
                                </span>
                              );
                            })()}
                          {activity.eventType && (
                            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md text-xs">
                              {t(`activity.eventType.${activity.eventType}`)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Time on the right */}
                    <div className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded border ml-3">
                      {convertToTimeOnly(activity.unixTimestamp, timezone)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowDetails;
