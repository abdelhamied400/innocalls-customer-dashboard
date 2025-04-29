"use client";
import CallerIdSelector from "@/components/CallerIdSelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import MultiSelect from "@/components/ui/multi-select";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import queryExtensions from "@/queries/queryExtensions";
import { AutoDialerCreateStep2 } from "@/validation/AutoDialerCreateCampaign";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

type CallDetailsFormProps = {
  onNext: () => void;
};
const CallDetailsForm = ({ onNext }: CallDetailsFormProps) => {
  const form = useFormContext<AutoDialerCreateStep2>();
  const { data: extensions, isLoading } = useQuery(queryExtensions({}));

  const {
    trigger,
    control,
    formState: { errors },
    clearErrors,
  } = form;

  const handleNext = async () => {
    const isValid = await trigger(["sound", "agents", "callerIds"]);

    if (isValid) {
      clearErrors();
      onNext();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={control}
        name="sound"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <div className="">
                <h3>Sound</h3>
                <Dropzone
                  options={{
                    accept: { "audio/mp3": [".mp3"] },
                    maxSize: SOUND_SIZE_LIMIT,
                    multiple: false,
                    maxFiles: 1,
                  }}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <DropzoneTrigger />
                  <DropzoneFileList />
                </Dropzone>
                <p className="text-destructive">{errors.sound?.message}</p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="playAnnouncement"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start gap-2">
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Play Announcement</FormLabel>
            </div>
          </FormItem>
        )}
      />

      <hr />
      <FormField
        control={control}
        name="agents"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start gap-2">
            <FormControl>
              <div className="flex-1">
                <h3>Attach Agents</h3>
                <div className="w-full">
                  <MultiSelect
                    options={extensions}
                    label="Agents"
                    placeholder="Select from the list...."
                    error={errors.agents?.message}
                    value={field.value}
                    onChange={field.onChange}
                  ></MultiSelect>
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <hr />

      <FormField
        control={control}
        name="callerIds"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start gap-2">
            <FormControl>
              <div className="flex-1">
                <h3>Caller IDs</h3>
                <CallerIdSelector {...field} />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <Button size="lg" onClick={handleNext}>
        Next
      </Button>
    </div>
  );
};

export default CallDetailsForm;
