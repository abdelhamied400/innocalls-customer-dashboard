"use client";
import withPermission from "@/containers/withPermission";
import FileAttachment from "@/components/FileAttachment";
import Property from "@/components/Property";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "@/providers/TranslationProvider";
import callBridgeService from "@/services/call-bridge.service";
import { useParams } from "next/navigation";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const CallBridgeDetails = () => {
  const t = useTranslations("callBridge.details");
  const { id } = useParams();
  const { data: bridge, isLoading } = useLocalizedQuery({
    queryKey: ["call-bridge-detail", id],
    queryFn: () => callBridgeService.getBridge(id as string),
    gcTime: 0,
    refetchInterval: 10000,
    refetchOnMount: "always",
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!bridge) {
    return <div>{t("notFound")}</div>;
  }

  return (
    <div className="call-bridge-details flex flex-col gap-4 bg-white p-4 rounded-lg">
      <div className="bridge-details flex flex-col gap-2">
        <h3>{t("sections.bridgeDetails")}</h3>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 divide-x">
            <Property label={t("fields.name")} value={bridge.name} />
            <Property
              label={t("fields.createdAt")}
              value={bridge.createdAt || "—"}
            />
          </div>
        </div>
      </div>

      <div className="recipients-details flex flex-col gap-2">
        <h3>{t("sections.recipientsConfiguration")}</h3>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 divide-x">
            <Property
              label={t("fields.firstRecipientTrialsCount")}
              value={bridge.firstRecipientTrialsCount}
            />
            <Property
              label={t("fields.secondRecipientTrialsCount")}
              value={bridge.secondRecipientTrialsCount}
            />
          </div>
          <hr />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 divide-x">
            <Property
              label={t("fields.firstRecipientDelay")}
              value={t("fields.minutesValue", {
                value: bridge.firstRecipientDelayMinutesBetweenTrials,
              })}
            />
            <Property
              label={t("fields.secondRecipientDelay")}
              value={t("fields.minutesValue", {
                value: bridge.secondRecipientDelayMinutesBetweenTrials,
              })}
            />
          </div>
          {bridge.warningTimeBeforeEnd != null && (
            <>
              <hr />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 divide-x">
                <Property
                  label={t("fields.warningTimeBeforeEnd")}
                  value={t("fields.minutesValue", {
                    value: bridge.warningTimeBeforeEnd,
                  })}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="callers-list flex flex-col gap-2 border rounded-lg">
        <div className="header p-4 bg-neutral-100 rounded-t-lg">
          <h3>{t("sections.callers")}</h3>
        </div>
        <Table>
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>{t("fields.destination")}</TableHead>
              <TableHead>{t("fields.callerNumber")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bridge.callers.map((caller, index) => (
              <TableRow key={index} className="border-0 hover:bg-transparent">
                <TableCell>{caller.destination}</TableCell>
                <TableCell>{caller.callerNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="sound flex flex-col gap-2 border rounded-lg">
        <div className="header p-4 bg-neutral-100 rounded-t-lg">
          <h3>{t("sections.soundFiles")}</h3>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 divide-x">
            <div className="flex-1 pe-3">
              <FileAttachment
                fileName={bridge.welcomeSoundFileName}
                fileType={t("fileTypes.mp3")}
              />
            </div>
            <div className="flex-1 ps-3">
              <FileAttachment
                fileName={bridge.alertSoundFileName}
                fileType={t("fileTypes.mp3")}
              />
            </div>
          </div>
          <hr />
          <div className="flex flex-col lg:flex-row gap-4 divide-x">
            <div className="flex-1 pe-3">
              <FileAttachment
                fileName={bridge.firstRecipientSorrySoundFileName}
                fileType={t("fileTypes.mp3")}
              />
            </div>
            <div className="flex-1 ps-3">
              <FileAttachment
                fileName={bridge.secondRecipientSorrySoundFileName}
                fileType={t("fileTypes.mp3")}
              />
            </div>
          </div>
          {bridge.warningSoundFileName && (
            <>
              <hr />
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <FileAttachment
                    fileName={bridge.warningSoundFileName}
                    fileType={t("fileTypes.mp3")}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withPermission(CallBridgeDetails, "fullAccessConferenceBridge");
