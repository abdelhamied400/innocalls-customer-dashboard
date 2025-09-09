"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Field from "@/components/ui/field";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MultiSelect from "@/components/select";
import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import webrtcService from "@/services/webrtc.service";
import useWebrtcStore from "@/store/webrtc.slice";
import { format } from "date-fns";
import { useVocab } from "@/hooks/useVocab";
import { useTranslations } from "@/providers/TranslationProvider";
import { SummarySchema } from "@/validation/summary";

// Infer the type from the schema
type CallSummaryFormData = z.infer<ReturnType<typeof SummarySchema>>;

interface CallSummaryFormProps {
  initialData?: Partial<CallSummaryFormData>;
}

const CallSummaryForm = ({ initialData }: CallSummaryFormProps) => {
  const t = useTranslations("webrtc.summary");

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lastCall, setCallSummaryModalOpen, clearLastCall } = useWebrtcStore();
  const { tags } = useVocab();
  const tagsOptions = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));

  const callSummarySchema = useMemo(() => SummarySchema(t), [t]); // CHECK THIS

  const form = useForm<CallSummaryFormData>({
    resolver: zodResolver(callSummarySchema),
    defaultValues: {
      comment: initialData?.comment || "",
      postCallTags: initialData?.postCallTags || [],
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      if (!lastCall || !lastCall.callId) return;

      await webrtcService.saveCallSummary({
        ...data,
        postCallTags: data.postCallTags.map((tag) => tag.value),
        callId: lastCall.callId,
        from: lastCall.from || "",
        to: lastCall.to || "",
        direction: lastCall.direction || "",
        duration: lastCall.duration || 0,
        callDateTime:
          format(
            lastCall.callDateTime || new Date(),
            "dd-MM-yyyy, h:mm:ss aaa"
          ) || "",
        status: lastCall.status || "Answered",
      });
      toast({
        title: t("form.submit.success.title"),
        description: t("form.submit.success.description"),
        variant: "default",
      });
      form.reset();
      setCallSummaryModalOpen(false);
    } catch (error) {
      toast({
        title: t("form.submit.failed.title"),
        description: t("form.submit.failed.description"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      clearLastCall();
    }
  });

  const handleCancel = () => {
    form.reset();
    setCallSummaryModalOpen(false);
    clearLastCall();
  };

  return (
    <div className="call-summary-form">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Comment Textarea */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Field
                    label={t("form.fields.comment.label")}
                    error={form.formState.errors.comment?.message || ""}
                    htmlFor="comment"
                  >
                    <Textarea
                      id="comment"
                      className="border-0 shadow-none focus-visible:ring-0"
                      placeholder={t("form.fields.comment.placeholder")}
                      {...field}
                    />
                  </Field>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Tags Multi-Select */}
          <FormField
            control={form.control}
            name="postCallTags"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiSelect
                    portalled={false}
                    label={t("form.fields.tags.label")}
                    error={form.formState.errors.postCallTags?.message || ""}
                    options={tagsOptions}
                    value={field.value}
                    onChange={field.onChange}
                    isMulti={true}
                    isCreatable={false}
                    placeholder={t("form.fields.tags.placeholder")}
                    showSelectedTags={true}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting
                ? t("form.submit.saving.title")
                : t("form.actions.save")}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              {t("form.actions.cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CallSummaryForm;
