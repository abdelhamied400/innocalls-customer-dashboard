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
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editContactSchema } from "@/validation/Webrtc";
import { useTranslations } from "@/providers/TranslationProvider";

type Contact = {
  id: string;
  name: string;
  phone: string;
};

const UpdateContact = () => {
  const t = useTranslations("webrtc.contacts");

  const { navigate, getParams } = useRouting();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id: contactId } = getParams("/contacts/update/:id");

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
    resolver: zodResolver(editContactSchema(t)),
  });

  // Load contact data when component mounts
  useEffect(() => {
    const loadContact = async () => {
      if (!contactId) {
        toast({
          title: t("messages.error"),
          description: t("error.contactIdMissing"),
          variant: "destructive",
        });
        navigate("/contacts/list");
        return;
      }

      try {
        setIsLoading(true);
        // Get contact from contacts list cache first
        const contactsData = queryClient.getQueryData(["contacts-list"]) as any;
        if (contactsData) {
          const allContacts =
            contactsData.pages?.flatMap((page: any) => page.contacts) ?? [];
          const foundContact = allContacts.find(
            (c: Contact) => c.id === contactId
          );

          if (foundContact) {
            setContact(foundContact);
            form.reset({
              name: foundContact.name,
              phone: foundContact.phone,
            });
          }
        }
      } catch (error) {
        toast({
          title: t("messages.error"),
          description: t("messages.failedToLoadContact"),
          variant: "destructive",
        });
        navigate("/contacts/list");
      } finally {
        setIsLoading(false);
      }
    };

    loadContact();
  }, [contactId, queryClient, form, toast, navigate]);

  const onSubmit = form.handleSubmit(async (data) => {
    if (!contactId) {
      toast({
        title: t("messages.error"),
        description: t("error.contactIdMissing"),
        variant: "destructive",
      });
      return;
    }

    try {
      await webrtcService.updateContact(contactId, data);
      await queryClient.invalidateQueries({
        queryKey: ["contacts-list"],
      });
      toast({
        title: t("messages.contactUpdated"),
        description: t("messages.contactUpdatedDescription"),
        variant: "success",
      });
      navigate("/contacts/list");
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: t("messages.error"),
          description:
            error.response?.data?.message ||
            t("messages.failedToUpdateContact"),
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

  if (isLoading) {
    return (
      <div className="update-contact">
        <PopoverCard>
          <PopoverCardHeader>
            <h3>{t("actions.update")}</h3>
          </PopoverCardHeader>
          <PopoverCardContent>
            <div className="flex items-center justify-center p-4">
              <p>{t("actions.loadingContact")}</p>
            </div>
          </PopoverCardContent>
        </PopoverCard>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="update-contact">
        <PopoverCard>
          <PopoverCardHeader>
            <h3>{t("actions.update")}</h3>
          </PopoverCardHeader>
          <PopoverCardContent>
            <div className="flex flex-col gap-2 items-center">
              <p>{t("messages.contactNotFound")}</p>
              <Button variant="link" onClick={handleCancel}>
                {t("actions.return")}
              </Button>
            </div>
          </PopoverCardContent>
        </PopoverCard>
      </div>
    );
  }

  return (
    <div className="update-contact">
      <PopoverCard>
        <PopoverCardHeader>
          <h3>{t("actions.update")}</h3>
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
                  {t("actions.update")}
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

export default UpdateContact;
