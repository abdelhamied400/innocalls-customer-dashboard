"use client";
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
import MultiSelect, {
  MultiSelectField,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import queryExtensions from "@/queries/queryExtensions";
import { AutoDialerCreateStep2 } from "@/validation/AutoDialerCreateCampaign";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
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
  } = form;

  const handleNext = async () => {
    const isValid = await trigger(["sound", "agents", "callerIds"]);

    if (isValid) onNext();
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
                  <MultiSelect>
                    <MultiSelectField
                      label="Select Agents"
                      error={errors.agents?.message}
                    >
                      <MultiSelectTrigger
                        options={extensions}
                        isMulti
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </MultiSelectField>

                    <MultiSelectValue
                      value={field.value}
                      onChange={field.onChange} // <-- important
                      isMulti
                    />
                  </MultiSelect>
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
                <div className="w-full caller-ids">
                  <div className="call-id bg-gray-50 border border-gray-100 p-4 rounded-lg flex gap-2 items-center">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost-destructive"
                      size="icon"
                      className="px-3"
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                  <Button variant="link">
                    <PlusIcon />
                    Add Caller
                  </Button>
                </div>
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
