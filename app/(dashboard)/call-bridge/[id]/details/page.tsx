"use client";
import withPermission from "@/containers/withPermission";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callBridgeService from "@/services/call-bridge.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { useDateFnsLocale, useLocale } from "@/providers/TranslationProvider";
import { format } from "date-fns";
import Dropzone, { DropzoneFileList } from "@/components/ui/dropzone";
import { formatDate } from "@/lib/date";

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const CallBridgeDetailsSheet = () => {
  const { id } = useParams();
  const bridgeId = Array.isArray(id) ? id[0] : id;
  const t = useTranslations("callBridge.details");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const locale = useDateFnsLocale();
  const lang = useLocale();

  const { data: bridge, isLoading } = useLocalizedQuery({
    queryKey: ["call-bridge-detail", bridgeId],
    queryFn: () => callBridgeService.getBridge(bridgeId as string),
    enabled: !!bridgeId,
  });

  const close = () => {
    setIsOpen(false);
    router.back();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <SheetContent
        side="bottom"
        className="h-screen p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <Button size="icon" variant="unstyled" onClick={close}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
            {isLoading && (
              <div className="text-muted-foreground">{t("loading")}</div>
            )}
            {!isLoading && !bridge && (
              <div className="text-center text-muted-foreground">
                {t("notFound")}
              </div>
            )}
            {!isLoading && bridge && (
              <div className="p-4 rounded-xl bg-white flex flex-col gap-6">
                <DetailRow label={t("fields.name")} value={bridge.name} />
                <hr />

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {t("fields.callers")}
                  </span>
                  {bridge.callers.map((caller, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm"
                    >
                      <span className="font-medium">{caller.destination}</span>
                      <span className="text-muted-foreground">—</span>
                      <span>{caller.callerNumber}</span>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label={t("fields.firstRecipientTrialsCount")}
                    value={bridge.firstRecipientTrialsCount}
                  />
                  <DetailRow
                    label={t("fields.secondRecipientTrialsCount")}
                    value={bridge.secondRecipientTrialsCount}
                  />
                  <DetailRow
                    label={t("fields.firstRecipientDelay")}
                    value={`${bridge.firstRecipientDelayMinutesBetweenTrials} min`}
                  />
                  <DetailRow
                    label={t("fields.secondRecipientDelay")}
                    value={`${bridge.secondRecipientDelayMinutesBetweenTrials} min`}
                  />
                  {bridge.warningTimeBeforeEnd != null && (
                    <DetailRow
                      label={t("fields.warningTimeBeforeEnd")}
                      value={`${bridge.warningTimeBeforeEnd} min`}
                    />
                  )}
                </div>

                <hr />

                <div className="flex flex-col gap-4">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {t("fields.soundFiles")}
                  </span>

                  {(
                    [
                      {
                        label: t("fields.welcomeSound"),
                        fileName: bridge.welcomeSoundFileName,
                      },
                      {
                        label: t("fields.alertSound"),
                        fileName: bridge.alertSoundFileName,
                      },
                      {
                        label: t("fields.firstRecipientSorrySound"),
                        fileName: bridge.firstRecipientSorrySoundFileName,
                      },
                      {
                        label: t("fields.secondRecipientSorrySound"),
                        fileName: bridge.secondRecipientSorrySoundFileName,
                      },
                      ...(bridge.warningSoundFileName
                        ? [
                            {
                              label: t("fields.warningSound"),
                              fileName: bridge.warningSoundFileName,
                            },
                          ]
                        : []),
                    ] as { label: string; fileName: string }[]
                  ).map(({ label, fileName }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {label}
                      </span>
                      <Dropzone fakeFiles={[fileName]} disabled>
                        <DropzoneFileList />
                      </Dropzone>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default withPermission(
  CallBridgeDetailsSheet,
  "fullAccessConferenceBridge",
);
