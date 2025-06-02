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

type EditUserFormProps = {
  initialUser: User;
};
const EditUserForm = ({ initialUser }: EditUserFormProps) => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const closeSheetRef = useRef<HTMLButtonElement>(null);

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
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
        title: "User edited successfully",
        description: `User ${res.name} has been edited successfully.`,
      });
      closeSheetRef.current?.click(); // Close the sheet
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate the users query to refresh the list
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error editing user",
          description:
            error.response?.data?.message || "An unknown error occurred.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error editing user",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        });
      }
    }
  }, console.error);

  return (
    <Stepper
      steps={["Edit new user"]}
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
            <p>Edit new user</p>
          </StepperHeaderTitle>
        </div>
        <Button size="icon" asChild variant="unstyled">
          <SheetClose ref={closeSheetRef}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
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
                        label="Name"
                        error={
                          form.formState.errors.name?.message?.toString() || ""
                        }
                        htmlFor="name"
                      >
                        <Input
                          id="name"
                          variant="field"
                          placeholder="Enter name..."
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
                        label="Email"
                        error={
                          form.formState.errors.email?.message?.toString() || ""
                        }
                        htmlFor="email"
                      >
                        <Input
                          id="email"
                          variant="field"
                          placeholder="Enter email..."
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
                name="ext"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label="Extension"
                        error={
                          form.formState.errors.ext?.message?.toString() || ""
                        }
                        htmlFor="ext"
                      >
                        <Input
                          id="ext"
                          variant="field"
                          placeholder="Enter extension..."
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
                        label="PIN"
                        error={
                          form.formState.errors.pin?.message?.toString() || ""
                        }
                        htmlFor="pin"
                      >
                        <Input
                          id="pin"
                          variant="field"
                          placeholder="Enter PIN..."
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
                        label="Inbound Calls"
                        htmlFor="inbound"
                        error={form.formState.errors.inbound?.message?.toString()}
                      >
                        <RadioGroup
                          {...field}
                          value={field.value?.toString() || "1"}
                          onValueChange={(value) => {
                            if (/^\d+$/.test(value)) {
                              onChange(parseInt(value, 10));
                            }
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="1" id="inbound-enable" />
                            <label htmlFor="inbound-enable">Enable</label>
                            <RadioGroupItem value="0" id="inbound-disable" />
                            <label htmlFor="inbound-disable">Disable</label>
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
                        label="Outbound Calls"
                        htmlFor="outbound"
                        error={form.formState.errors.outbound?.message?.toString()}
                      >
                        <RadioGroup
                          {...field}
                          value={field.value?.toString() || "1"}
                          onValueChange={(value) => {
                            if (/^\d+$/.test(value)) {
                              onChange(parseInt(value, 10));
                            }
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="1" id="outbound-enable" />
                            <label htmlFor="outbound-enable">Enable</label>
                            <RadioGroupItem value="0" id="outbound-disable" />
                            <label htmlFor="outbound-disable">Disable</label>
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
                        label="Voicemail"
                        htmlFor="voicemail"
                        error={form.formState.errors.voicemail?.message?.toString()}
                      >
                        <RadioGroup
                          {...field}
                          value={field.value?.toString() || "0"}
                          onValueChange={(value) => {
                            if (/^\d+$/.test(value)) {
                              onChange(parseInt(value, 10));
                            }
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="1" id="voicemail-enable" />
                            <label htmlFor="voicemail-enable">Enable</label>
                            <RadioGroupItem value="0" id="voicemail-disable" />
                            <label htmlFor="voicemail-disable">Disable</label>
                          </div>
                        </RadioGroup>
                      </RadioGroupField>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Edit new user</Button>
            </StepperStep>
          </form>
        </Form>
      </StepperSteps>
    </Stepper>
  );
};

export default EditUserForm;
