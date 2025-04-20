"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import SpinButton from "@/components/ui/spin-button";
import { Checkbox } from "@/components/ui/checkbox";

const CampaignDetailsForm = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      waitingCustomerCount: "0",
      trialsCount: "0",
      wrapUpTime: "0",
      delayMinutesBetweenTrials: "0",
      hideCallerInfo: false,
      agentCanLogoutAndRejoin: false,
    },
  });

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4 overflow-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <Field label="Campaign name" error={""}>
              <FormItem>
                <FormControl>
                  <Input
                    variant="field"
                    placeholder="Enter campaign name..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />
        <FormField
          control={form.control}
          name="waitingCustomerCount"
          render={({ field }) => (
            <Field
              label="Waiting Customer Count*"
              labelAlign="center"
              hint="The number of customers that can wait in the queue"
              error={""}
            >
              <FormItem className="w-full">
                <FormControl>
                  <SpinButton {...field} />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />
        <FormField
          control={form.control}
          name="trialsCount"
          render={({ field }) => (
            <Field
              label="Trials Count*"
              labelAlign="center"
              hint="The number of trials to call each customer"
              error={""}
            >
              <FormItem className="w-full">
                <FormControl>
                  <SpinButton {...field} />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />
        <FormField
          control={form.control}
          name="wrapUpTime"
          render={({ field }) => (
            <Field
              label="Wrap Up Time"
              labelAlign="center"
              hint="The time (seconds) between the end of a call and the start of the next call"
              error={""}
            >
              <FormItem className="w-full">
                <FormControl>
                  <SpinButton {...field} />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />
        <FormField
          control={form.control}
          name="delayMinutesBetweenTrials"
          render={({ field }) => (
            <Field
              label="Delay Minutes Between Trials"
              labelAlign="center"
              error={""}
            >
              <FormItem className="w-full">
                <FormControl>
                  <SpinButton {...field} />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name="hideCallerInfo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Hide Caller Info</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Agent Can Logout And Rejoin */}
        <FormField
          control={form.control}
          name="agentCanLogoutAndRejoin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Agent Can Logout And Rejoin</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button>Next</Button>
      </div>
    </Form>
  );
};

export default CampaignDetailsForm;
