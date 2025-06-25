"use client";

import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  RadioGroup,
  RadioGroupField,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import editUserSchema, { type EditUserSchema } from "@/validation/EditUser";
import usersService from "@/services/users.service";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../../(list)/columns";
import { useTranslations } from "next-intl";

type EditUserFormProps = {
  initialUser: User;
};
const EditUserForm = ({ initialUser }: EditUserFormProps) => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const closeSheetRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("users");
  const commonT = useTranslations("common");

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema(t)),
    defaultValues: {
      ...initialUser,
      extensionId: parseInt(initialUser.id, 10),
      ext: initialUser.ext ? parseInt(initialUser.ext, 10) : undefined,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await usersService.editUser({
        ...data,
      });
      toast({
        title: t("update.messages.success"),
        description: t("update.messages.successDescription", {
          name: res.name,
        }),
      });
      closeSheetRef.current?.click(); // Close the sheet
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate the users query to refresh the list
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: t("update.messages.error"),
          description:
            error.response?.data?.message || t("update.messages.unknownError"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("update.messages.error"),
          description:
            error instanceof Error
              ? error.message
              : t("update.messages.unknownError"),
        });
      }
    }
  }, console.error);

  return (
    <Stepper
      steps={[t("update.title")]}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ChevronLeftIcon />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("update.title")}</p>
          </StepperHeaderTitle>
        </div>
        <Button size="icon" asChild variant="unstyled">
          <SheetClose ref={closeSheetRef}>
            <X className="h-4 w-4" />
            <span className="sr-only">{commonT("actions.close")}</span>
          </SheetClose>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh - 200px)] overflow-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="h-full">
            <StepperStep
              idx={0}
              className="p-4 rounded-xl bg-white h-full flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("create.form.fields.name.label")}
                        error={
                          form.formState.errors.name?.message?.toString() || ""
                        }
                        htmlFor="name"
                      >
                        <Input
                          id="name"
                          variant="field"
                          placeholder={t("create.form.fields.name.placeholder")}
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("create.form.fields.email.label")}
                        error={
                          form.formState.errors.email?.message?.toString() || ""
                        }
                        htmlFor="email"
                      >
                        <Input
                          id="email"
                          variant="field"
                          placeholder={t(
                            "create.form.fields.email.placeholder"
                          )}
                          type="email"
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("create.form.fields.password.label")}
                        error={
                          form.formState.errors.password?.message?.toString() ||
                          ""
                        }
                        htmlFor="password"
                      >
                        <Input
                          id="password"
                          variant="field"
                          placeholder={t(
                            "create.form.fields.password.placeholder"
                          )}
                          type="password"
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ext"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("create.form.fields.ext.label")}
                        error={
                          form.formState.errors.ext?.message?.toString() || ""
                        }
                        htmlFor="ext"
                      >
                        <Input
                          id="ext"
                          variant="field"
                          placeholder={t("create.form.fields.ext.placeholder")}
                          disabled
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            // check if the value is a valid number
                            if (/^\d*$/.test(value)) {
                              field.onChange(+value);
                            }
                          }}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("create.form.fields.pin.label")}
                        error={
                          form.formState.errors.pin?.message?.toString() || ""
                        }
                        htmlFor="pin"
                      >
                        <Input
                          id="pin"
                          variant="field"
                          placeholder={t("create.form.fields.pin.placeholder")}
                          type="password"
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inbound"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroupField
                        label={t("create.form.fields.inbound.label")}
                        htmlFor="inbound"
                        error={form.formState.errors.inbound?.message?.toString()}
                      >
                        <RadioGroup
                          {...field}
                          value={field.value > 0 ? "1" : "0"}
                          onValueChange={(value) => {
                            if (/^\d+$/.test(value)) {
                              onChange(parseInt(value, 10));
                            }
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="1" id="inbound-enable" />
                            <label htmlFor="inbound-enable">
                              {" "}
                              {t("create.form.fields.inbound.enable")}
                            </label>
                            <RadioGroupItem value="0" id="inbound-disable" />
                            <label htmlFor="inbound-disable">
                              {t("create.form.fields.inbound.disable")}
                            </label>
                          </div>
                        </RadioGroup>
                      </RadioGroupField>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outbound"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroupField
                        label={t("create.form.fields.outbound.label")}
                        htmlFor="outbound"
                        error={form.formState.errors.outbound?.message?.toString()}
                      >
                        <RadioGroup
                          {...field}
                          value={field.value > 0 ? "1" : "0"}
                          onValueChange={(value) => {
                            if (/^\d+$/.test(value)) {
                              onChange(parseInt(value, 10));
                            }
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="1" id="outbound-enable" />
                            <label htmlFor="outbound-enable">
                              {" "}
                              {t("create.form.fields.outbound.enable")}
                            </label>
                            <RadioGroupItem value="0" id="outbound-disable" />
                            <label htmlFor="outbound-disable">
                              {" "}
                              {t("create.form.fields.outbound.disable")}
                            </label>
                          </div>
                        </RadioGroup>
                      </RadioGroupField>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="voicemail"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroupField
                        label={t("create.form.fields.voicemail.label")}
                        htmlFor="voicemail"
                        error={form.formState.errors.voicemail?.message?.toString()}
                      >
                        <RadioGroup
                          {...field}
                          value={field.value > 0 ? "1" : "0"}
                          onValueChange={(value) => {
                            if (/^\d+$/.test(value)) {
                              onChange(parseInt(value, 10));
                            }
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="1" id="voicemail-enable" />
                            <label htmlFor="voicemail-enable">
                              {t("create.form.fields.voicemail.enable")}
                            </label>
                            <RadioGroupItem value="0" id="voicemail-disable" />
                            <label htmlFor="voicemail-disable">
                              {t("create.form.fields.voicemail.disable")}
                            </label>
                          </div>
                        </RadioGroup>
                      </RadioGroupField>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {t("update.actions.submit")}
              </Button>
            </StepperStep>
          </form>
        </Form>
      </StepperSteps>
    </Stepper>
  );
};

export default EditUserForm;
