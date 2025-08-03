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
import { useEffect, useState } from "react";

type Contact = {
  id: string;
  name: string;
  phone: string;
};

const UpdateContact = () => {
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
  });

  // Load contact data when component mounts
  useEffect(() => {
    const loadContact = async () => {
      if (!contactId) {
        toast({
          title: "Error",
          description: "Contact ID is missing.",
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
          title: "Error",
          description: "Failed to load contact.",
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
        title: "Error",
        description: "Contact ID is missing.",
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
        title: "Contact Updated",
        description: "The contact has been updated successfully.",
        variant: "success",
      });
      navigate("/contacts/list");
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to update contact.",
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

  if (isLoading) {
    return (
      <div className="update-contact">
        <PopoverCard>
          <PopoverCardHeader>
            <h3>Update Contact</h3>
          </PopoverCardHeader>
          <PopoverCardContent>
            <div className="flex items-center justify-center p-4">
              <p>Loading contact...</p>
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
            <h3>Update Contact</h3>
          </PopoverCardHeader>
          <PopoverCardContent>
            <div className="flex flex-col gap-2 items-center">
              <p>Contact not found.</p>
              <Button variant="link" onClick={handleCancel}>
                Back to Contacts
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
          <h3>Update Contact</h3>
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
                  Update Contact
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

export default UpdateContact;
