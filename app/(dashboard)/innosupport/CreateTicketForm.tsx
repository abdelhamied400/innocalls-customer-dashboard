"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTicketSchema,
  CreateTicketFormValues,
} from "@/validation/CreateTicket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import ticketsService, { Department } from "@/services/tickets.service";
import Select from "@/components/Select";
import { Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type SelectOption = {
  label: string;
  value: string;
};

type CreateTicketFormProps = {
  onSubmit: (data: CreateTicketFormValues) => Promise<void>;
  isSubmitting: boolean;
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const CreateTicketForm = ({ onSubmit, isSubmitting }: CreateTicketFormProps) => {
  const t = useTranslations("innoSupport.create");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { data: departments = [] } = useLocalizedQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: ticketsService.getDepartments,
  });

  const departmentOptions: SelectOption[] = departments.map((dept) => ({
    label: dept.name,
    value: dept.id,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(CreateTicketSchema(t)),
    defaultValues: {
      subject: "",
      departmentId: "",
      description: "",
    },
  });

  const watchedDepartmentId = watch("departmentId");
  const watchedDescription = watch("description");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setValue("file", undefined);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field label={t("form.subject")} error={errors.subject?.message}>
        <Input
          variant="field"
          {...register("subject")}
          placeholder={t("form.subjectPlaceholder")}
        />
      </Field>

      <Select<SelectOption, false>
        label={t("form.department")}
        options={departmentOptions}
        value={
          watchedDepartmentId
            ? departmentOptions.find(
                (opt) => opt.value === watchedDepartmentId
              ) || null
            : null
        }
        onChange={(option) => {
          setValue("departmentId", option?.value?.toString() || "", {
            shouldValidate: true,
          });
        }}
        placeholder={t("form.departmentPlaceholder")}
        error={errors.departmentId?.message}
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("form.description")}</label>
        <ReactQuill
          theme="snow"
          value={watchedDescription}
          onChange={(value) => {
            const isEmpty = value === "<p><br></p>" || value === "";
            setValue("description", isEmpty ? "" : value, {
              shouldValidate: true,
            });
          }}
          modules={quillModules}
          placeholder={t("form.descriptionPlaceholder")}
        />
        {errors.description?.message && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Field
          label={t("form.attachment")}
          error={errors.file?.message as string}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {fileName ? (
            <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1 truncate">{fileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Paperclip className="h-4 w-4" />
              {t("form.attachFile")}
            </Button>
          )}
        </Field>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {t("form.submit")}
        </Button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
