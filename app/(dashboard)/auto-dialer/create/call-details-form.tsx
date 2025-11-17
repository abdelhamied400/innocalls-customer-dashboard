"use client";
import CallerIdSelector from "@/components/CallerId/CallerIdSelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Select from "@/components/Select";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import queryExtensions from "@/queries/queryExtensions";
import { AutoDialerCreateStep2 } from "@/validation/AutoDialerCreateCampaign";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useFormContext } from "react-hook-form";
import { timezones } from "@/constants/timezones";
import Field from "@/components/ui/field";

type CallDetailsFormProps = {
  onNext: () => void;
};
const CallDetailsForm = ({ onNext }: CallDetailsFormProps) => {
  const form = useFormContext<AutoDialerCreateStep2>();
  const { data: extensions } = useLocalizedQuery(queryExtensions({}));

  const {
    watch,
    trigger,
    control,
    formState: { errors },
    clearErrors,
  } = form;

  const handleNext = async () => {
    const isValid = await trigger(["loopSoundFile", "agents", "callerIds"]);

    if (isValid) {
      clearErrors();
      onNext();
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="loopSoundFile"
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
                  <p className="text-destructive">
                    {errors.loopSoundFile?.message}
                  </p>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hasAnnouncement"
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

        {watch("hasAnnouncement") && (
          <FormField
            control={control}
            name="announcement"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="">
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
                    <p className="text-destructive">
                      {errors.announcement?.message}
                    </p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <hr />
        <FormField
          control={control}
          name="agents"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-row items-start gap-2 w-full">
                <FormControl>
                  <Select
                    className="w-full"
                    label="Agents"
                    error={errors.agents?.message}
                    options={
                      extensions?.map((ext) => ({
                        label: `${ext.name} (${ext.ext})`,
                        value: ext.id,
                      })) || []
                    }
                    placeholder="Select from the list...."
                    value={
                      extensions
                        ? extensions
                            .filter((ext) =>
                              Array.isArray(field.value)
                                ? field.value.includes(ext.id)
                                : false
                            )
                            .map((ext) => ({
                              label: `${ext.name} (${ext.ext})`,
                              value: ext.id,
                            }))
                        : []
                    }
                    onChange={(data) =>
                      field.onChange(data.map((d) => d.value))
                    }
                    isMulti
                  ></Select>
                </FormControl>
              </FormItem>
            );
          }}
        />

        <hr />

        <div className="flex-1">
          <h3>Caller IDs</h3>
          <CallerIdSelector />
          {errors.callerIds?.message && (
            <p className="text-destructive mt-2">{errors.callerIds.message}</p>
          )}
        </div>

        <Button size="lg" onClick={handleNext} type="button">
          Next
        </Button>
      </div>
    </Form>
  );
};

export default CallDetailsForm;
