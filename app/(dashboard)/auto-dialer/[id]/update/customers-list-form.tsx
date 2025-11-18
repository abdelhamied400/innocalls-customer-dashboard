import { Button } from "@/components/ui/button";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { CSV_SIZE_LIMIT } from "@/constants/file";
import autoDialerService from "@/services/auto-dialer.service";
import { AutoDialerUpdateStep4 } from "@/validation/AutoDialerUpdateCampaign";
import { DownloadIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

type CustomersListFormProps = {
  onNext: () => void;
};
const CustomersListForm = ({ onNext }: CustomersListFormProps) => {
  const form = useFormContext<AutoDialerUpdateStep4>();

  const {
    trigger,
    control,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const isValid = await trigger(["customers"]);

    if (isValid) {
      // Proceed to the next step
    }
  };

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
          <DownloadIcon /> Download a template
        </Button>
      </div>

      <ul className="list-disc list-inside space-y-2">
        <li>Ensure all phone numbers include the country code.</li>
        <li>Do not use &quot;+&quot; or &quot;00&quot; before the code.</li>
        <li>
          Set the field type to &quot;number&quot; without decimal points.
        </li>
      </ul>

      <Button className="w-full" onClick={handleNext}>
        Next
      </Button>
    </div>
  );
};

export default CustomersListForm;
