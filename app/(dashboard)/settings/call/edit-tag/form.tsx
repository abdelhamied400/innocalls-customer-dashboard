"use client";

import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetClose } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/providers/TranslationProvider";
import vocabService from "@/services/vocab.service";
import { FullTag } from "@/types/api/tag";
import { EditTagSchema, EditTagFormValues } from "@/validation/EditTag";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { X } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";

type EditTagFormProps = {
  tag: FullTag;
};

const EditTagForm = ({ tag }: EditTagFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const closeSheetRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("settings.call.editTag");

  const form = useForm<EditTagFormValues>({
    resolver: zodResolver(EditTagSchema(t)),
    defaultValues: {
      nameAR: tag.nameAR,
      nameEN: tag.nameEN,
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await vocabService.updateTag(tag.id, data, tag.isDeleted);

      // Optimistic update
      queryClient.setQueryData<FullTag[]>(["tags"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((t) =>
          t.id === tag.id ? { ...t, nameAR: data.nameAR, nameEN: data.nameEN } : t
        );
      });

      toast({
        title: t("messages.updateSuccess"),
        variant: "success",
      });

      // Close sheet and refetch
      closeSheetRef.current?.click();
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: t("messages.updateFailed"),
          description: error.response?.data?.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("messages.updateFailed"),
          variant: "destructive",
        });
      }
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <Button size="icon" asChild variant="ghost">
          <SheetClose ref={closeSheetRef}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("actions.close")}</span>
          </SheetClose>
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4 max-w-md mx-auto">
            <FormField
              control={form.control}
              name="nameAR"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Field
                      label={t("form.fields.nameAR.label")}
                      error={errors.nameAR?.message}
                      htmlFor="nameAR"
                    >
                      <Input
                        id="nameAR"
                        variant="field"
                        placeholder={t("form.fields.nameAR.placeholder")}
                        dir="rtl"
                        {...field}
                      />
                    </Field>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameEN"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Field
                      label={t("form.fields.nameEN.label")}
                      error={errors.nameEN?.message}
                      htmlFor="nameEN"
                    >
                      <Input
                        id="nameEN"
                        variant="field"
                        placeholder={t("form.fields.nameEN.placeholder")}
                        {...field}
                      />
                    </Field>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {t("actions.save")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditTagForm;
