"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Field from "@/components/ui/field";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MultiSelect from "@/components/select";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import webrtcService from "@/services/webrtc.service";
import useWebrtcStore from "@/store/webrtc.slice";
import { format } from "date-fns";
import { useVocab } from "@/hooks/useVocab";

// Define the schema for the call summary form
const callSummarySchema = z.object({
  comment: z.string().trim().min(1, "Comment is required"),
  postCallTags: z
    .array(
      z.object({
        label: z.string().min(2).max(100),
        value: z.string().min(2).max(100),
      })
    )
    .min(1, "At least one tag is required"),
});

type CallSummaryFormData = z.infer<typeof callSummarySchema>;

interface CallSummaryFormProps {
  initialData?: Partial<CallSummaryFormData>;
}

const CallSummaryForm = ({ initialData }: CallSummaryFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lastCall, setCallSummaryModalOpen, clearLastCall } = useWebrtcStore();
  const { tags } = useVocab();
  const tagsOptions = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));

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
            "dd-MM-yyyy hh:mm:ss a"
          ) || "",
        status: lastCall.status || "Answered",
      });
      toast({
        title: "Call Summary Saved",
        description: "Your call summary has been saved successfully.",
        variant: "default",
      });
      form.reset();
      setCallSummaryModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save call summary. Please try again.",
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
                    label="Comment"
                    error={form.formState.errors.comment?.message || ""}
                    htmlFor="comment"
                  >
                    <Textarea
                      id="comment"
                      className="border-0 shadow-none focus-visible:ring-0"
                      placeholder="Enter your call summary here..."
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
                    label="Post Call Tags"
                    error={form.formState.errors.postCallTags?.message || ""}
                    options={tagsOptions}
                    value={field.value}
                    onChange={field.onChange}
                    isMulti={true}
                    isCreatable={true}
                    placeholder="Select or create post call tags..."
                    showSelectedTags={true}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Summary"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CallSummaryForm;
