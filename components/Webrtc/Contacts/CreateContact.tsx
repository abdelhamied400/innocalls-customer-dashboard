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
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactSchema } from "@/validation/Webrtc";
import { useTranslations } from "next-intl";

const CreateContact = () => {
  const t = useTranslations("webrtc.contacts");

  const { navigate } = useRouting();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
    resolver: zodResolver(createContactSchema(t)),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await webrtcService.createContact(data);
      await queryClient.invalidateQueries({
        queryKey: ["contacts-list"],
      });

      toast({
        title: t("messages.contactCreated"),
        description: t("messages.contactCreatedDescription"),
        variant: "success",
      });

      navigate("/contacts/list");
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: t("messages.error"),
          description:
            error.response?.data?.message ||
            t("messages.failedToCreateContact"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("messages.error"),
          description: t("messages.unexpectedError"),
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
          <h3>{t("actions.create")}</h3>
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
                          label={t("form.fields.name.label")}
                          error={
                            form.formState.errors.name?.message?.toString() ||
                            ""
                          }
                          htmlFor="name"
                        >
                          <Input
                            id="name"
                            variant="field"
                            placeholder={t("form.fields.name.placeholder")}
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
                          label={t("form.fields.phone.label")}
                          error={
                            form.formState.errors.phone?.message?.toString() ||
                            ""
                          }
                          htmlFor="phone"
                        >
                          <Input
                            id="phone"
                            variant="field"
                            placeholder={t("form.fields.phone.placeholder")}
                            {...field}
                          />
                        </Field>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-4">
                  {t("actions.create")}
                </Button>
              </form>
            </Form>
            <Button
              variant="link"
              onClick={handleCancel}
              disabled={form.formState.isSubmitting}
            >
              {t("actions.return")}
            </Button>
          </div>
        </PopoverCardContent>
      </PopoverCard>
    </div>
  );
};

export default CreateContact;
