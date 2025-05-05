import { Button } from "@/components/ui/button";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { CSV_SIZE_LIMIT } from "@/constants/file";
import { AutoDialerCreateStep4 } from "@/validation/AutoDialerCreateCampaign";
import { DownloadIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

type CustomersListFormProps = {
  onNext: () => void;
};
const CustomersListForm = ({ onNext }: CustomersListFormProps) => {
  const form = useFormContext<AutoDialerCreateStep4>();

  const {
    trigger,
    control,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const isValid = await trigger(["customers"]);

    if (isValid) {
      // Proceed to the next step
      console.log("Valid customers list");
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
                      "image/jpeg": [".jpg", ".jpeg"],
                      "image/png": [".png"],
                      "application/pdf": [".pdf"],
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
        <Button variant="link" onClick={handleNext}>
          <DownloadIcon /> Download a template
        </Button>
      </div>

      <ul className="list-disc list-inside space-y-2">
        <li>Ensure all phone numbers include the country code.</li>
        <li>Do not use "+" or "00" before the code.</li>
        <li>Set the field type to "number" without decimal points.</li>
      </ul>

      <Button className="w-full" onClick={handleNext}>
        Next
      </Button>
    </div>
  );
};

export default CustomersListForm;
