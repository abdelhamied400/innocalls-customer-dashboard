import { Row } from "@tanstack/react-table";
import { AgentPerformance } from "./columns";
import {
  CalendarDays,
  Phone,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { useTranslations } from "@/providers/TranslationProvider";

type RowDetailsProps = {
  row: Row<AgentPerformance>;
};

const RowDetails = ({ row }: RowDetailsProps) => {
  const t = useTranslations("users.agentPerformance.table.details");
  const callStatistics = row.original.callStatistics;

  if (!callStatistics || callStatistics.length === 0) {
    return (
      <div className="mt-2 text-center text-gray-400 py-4">
        {t("noCallStats")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-2">
      {callStatistics.map((stat, idx) => (
        <div key={stat.date + idx} className="border-b pb-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-blue-700 text-base">
              {stat.date}
            </span>
          </div>
          <div className="flex flex-col gap-2 pl-6">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-green-500" />
              <span>
                {t("answeredCalls")}:{" "}
                <span className="font-bold text-green-700">
                  {stat.answeredCalls}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>
                {t("totalCalls")}:{" "}
                <span className="font-bold text-gray-700">
                  {stat.totalCalls}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>
                {t("totalTalkTime")}:{" "}
                <span className="font-bold text-indigo-700">
                  {stat.totalTalkTime}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-yellow-500" />
              <span>
                {t("firstCall")}:{" "}
                <span className="font-bold text-yellow-700">
                  {stat.firstCall}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowDownLeft className="w-4 h-4 text-yellow-500" />
              <span>
                {t("latestCall")}:{" "}
                <span className="font-bold text-yellow-700">
                  {stat.latestCall}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-purple-500" />
              <span>
                {t("firstAnsweredCall")}:{" "}
                <span className="font-bold text-purple-700">
                  {stat.firstAnsweredCall || "-"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowDownLeft className="w-4 h-4 text-purple-500" />
              <span>
                {t("latestAnsweredCall")}:{" "}
                <span className="font-bold text-purple-700">
                  {stat.latestAnsweredCall || "-"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>
                {t("longestCall")}:{" "}
                <span className="font-bold text-orange-700">
                  {stat.longestCall}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>
                {t("shortestCall")}:{" "}
                <span className="font-bold text-orange-700">
                  {stat.shortestCall}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RowDetails;
