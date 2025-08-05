"use client";
import { getLatestCallLog } from "@/lib/call-log";
import CallLogRow from "./CallLog/CallLogRow";
import PopoverCard, {
  PopoverCardContent,
  PopoverCardHeader,
} from "./Shared/PopoverCard";
import { useSip } from "@/providers/webrtc/SipProvider";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import CallLogCallRow from "./CallLog/CallLogCallRow";
import { useState } from "react";
import { useTranslations } from "next-intl";

const CallLog = () => {
  const t = useTranslations("webrtc.callLog");

  const { extension, call } = useSip();
  const [openLogs, setOpenLogs] = useState<Record<string, boolean>>({});

  if (!extension) {
    return null;
  }

  const callLogs = getLatestCallLog(extension.ext);

  const toggleLog = (number: string) => {
    setOpenLogs((prev) => ({
      ...prev,
      [number]: !prev[number],
    }));
  };

  const handleCallClick = (number: string) => {
    call(number);
  };

  return (
    <div className="call-log">
      <PopoverCard>
        <PopoverCardHeader>
          <h3>{t("title")}</h3>
        </PopoverCardHeader>
        <PopoverCardContent>
          {callLogs.length > 0 ? (
            <div className="call-log-list flex flex-col">
              {callLogs.map((log) => (
                <Collapsible
                  key={log.number}
                  open={openLogs[log.number] || false}
                  onOpenChange={() => toggleLog(log.number)}
                >
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => toggleLog(log.number)}
                  >
                    <CallLogRow
                      number={log.number}
                      name={log.name}
                      time={log.time}
                      stats={log.stats}
                      onCall={() => handleCallClick(log.number)}
                    />
                  </div>
                  <CollapsibleContent className="py-2 ms-2 flex flex-col gap-2 border-s border-dashed ps-2">
                    {log.calls.map((call) => (
                      <CallLogCallRow
                        key={`${log.number}-${call.id}`}
                        number={call.number}
                        name={call.name}
                        time={call.time}
                        type={call.type}
                        id={call.id}
                      />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          ) : (
            <div className="call-log-content">
              <p className="text-sm text-gray-500">{t("noCalls")}</p>
            </div>
          )}
        </PopoverCardContent>
      </PopoverCard>
    </div>
  );
};
export default CallLog;
