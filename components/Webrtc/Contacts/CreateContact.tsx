"use client";
import { Button } from "@/components/ui/button";
import PopoverCard, {
  PopoverCardContent,
  PopoverCardHeader,
} from "../Shared/PopoverCard";
import { useRouting } from "@/providers/RoutingProvider";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import webrtcService from "@/services/webrtc.service";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const CreateContact = () => {
  const { navigate } = useRouting();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await webrtcService.createContact(data);
      await queryClient.invalidateQueries({
        queryKey: ["contacts-list"],
      });
      toast({
        title: "Contact Created",
        description: "The contact has been created successfully.",
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to create contact.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  });

  const handleCancel = () => {
    navigate("/contacts/list");
  };
  return (
    <div className="create-contact">
      <PopoverCard>
        <PopoverCardHeader>
          <h3>Create Contact</h3>
        </PopoverCardHeader>
        <PopoverCardContent>
          <div className="flex flex-col gap-2-items-center">
            <Form {...form}>
              <form onSubmit={onSubmit} className="h-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={"Contact Name"}
                          error={
                            form.formState.errors.name?.message?.toString() ||
                            ""
                          }
                          htmlFor="name"
                        >
                          <Input
                            id="name"
                            variant="field"
                            placeholder={"Contact Name"}
                            {...field}
                          />
                        </Field>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={"Phone Number"}
                          error={
                            form.formState.errors.phone?.message?.toString() ||
                            ""
                          }
                          htmlFor="phone"
                        >
                          <Input
                            id="phone"
                            variant="field"
                            placeholder={"Phone Number"}
                            {...field}
                          />
                        </Field>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-4">
                  Create Contact
                </Button>
              </form>
            </Form>
            <Button variant="link" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </PopoverCardContent>
      </PopoverCard>
    </div>
  );
};

export default CreateContact;
