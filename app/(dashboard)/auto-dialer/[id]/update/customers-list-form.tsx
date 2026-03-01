import { Button } from "@/components/ui/button";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { CSV_SIZE_LIMIT } from "@/constants/file";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { AutoDialerUpdateStep4 } from "@/validation/AutoDialerUpdateCampaign";
import { DownloadIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";

type CustomersListFormProps = {
  onNext: () => void;
};
const CustomersListForm = ({}: CustomersListFormProps) => {
  const t = useTranslations(
    "autoDialer.updateCampaign.steps.customersList.form",
  );
  const { id } = useParams();
  const form = useFormContext<AutoDialerUpdateStep4>();
  const { data: campaign } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
  });

  const {
    control,
    formState: { errors },
  } = form;

  const downloadTemplate = async () => {
    try {
      await autoDialerService.downloadTemplate();
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  return (
    <div className="customer-list-form flex flex-col gap-4">
      <FormField
        control={control}
        name="customers"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <div className="">
                <Dropzone
                  options={{
                    accept: {
                      "text/csv": [".csv"],
                    },
                    maxSize: CSV_SIZE_LIMIT,
                    multiple: false,
                    maxFiles: 1,
                  }}
                  value={field.value}
                  onChange={field.onChange}
                  fakeFiles={campaign?.fileName ? [campaign.fileName] : []}
                  disabled={!!campaign?.fileName}
                >
                  <DropzoneTrigger />
                  <DropzoneFileList />
                </Dropzone>
                <p className="text-destructive">{errors.customers?.message}</p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <div className="">
        <Button variant="link" onClick={downloadTemplate} type="button">
          <DownloadIcon /> {t("downloadTemplate")}
        </Button>
      </div>

      <ul className="list-disc list-inside space-y-2">
        <li>{t("list.0")}</li>
        <li>{t("list.1")}</li>
        <li>{t("list.2")}</li>
      </ul>

      <div className="flex items-center gap-2">
        <Button className="w-full" value="update">
          {t("update")}
        </Button>
        <Button className="w-full" value="save" variant="outline">
          {t("save")}
        </Button>
      </div>
    </div>
  );
};

export default CustomersListForm;
