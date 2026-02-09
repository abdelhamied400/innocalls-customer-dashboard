"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "@/providers/TranslationProvider";
import TagsTable from "./table";
import useAuthStore from "@/store/auth.slice";
import { Organization } from "@/types/api/organization";
import settingsService from "@/services/settings.service";
import { toast } from "sonner";

const CallSettings = () => {
  const t = useTranslations("settings.call");
  const { Organization, setOrganization } = useAuthStore();

  const handleToggleAfterCallSummary = async (checked: boolean) => {
    try {
      await settingsService.toggleAfterCallSummary();

      setOrganization({
        ...(Organization || ({} as Organization)),
        enableAfterCallTags: checked,
      });

      toast.success(t("callSummary.toggleSuccess"));
    } catch (error) {
      toast.error(t("callSummary.toggleFailed"));
    }
  };

  return (
    <div className="page h-full" id="call-settings">
      <Accordion
        type="multiple"
        defaultValue={["manage-tags"]}
        className="flex flex-col h-full gap-2"
      >
        <AccordionItem value="call-summary" className="border rounded-lg">
          <AccordionTrigger className="p-4">
            {t("callSummary.title")}
          </AccordionTrigger>
          <AccordionContent className="p-2 flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            <div className="flex items-center gap-2">
              <Switch
                checked={Organization?.enableAfterCallTags}
                onCheckedChange={handleToggleAfterCallSummary}
              />{" "}
              <p>{t("callSummary.enableAfterEveryCall")}</p>
            </div>
            {/* <div className="flex items-center gap-2">
              <Switch />{" "}
              <p>{t("callSummary.enableAfterConnectedCalls")}</p>
            </div> */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="manage-tags"
          className="border rounded-lg data-[state=open]:flex-1 flex flex-col"
        >
          <AccordionTrigger className="p-4 font-medium">
            {t("tags.title")}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2 flex flex-col gap-2 h-[calc(100vh-380px)] overflow-y-auto">
            <TagsTable />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CallSettings;
