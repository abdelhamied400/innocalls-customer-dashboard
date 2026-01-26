"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import vocabService from "@/services/vocab.service";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import EditTagForm from "./form";
import Spinner from "@/components/ui/spinner";

const EditTag = () => {
  const searchParams = useSearchParams();
  const tagId = searchParams.get("id");
  const t = useTranslations("settings.call.editTag");

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: vocabService.getAllTags,
  });

  const tag = tags.find((t) => t.id === tagId);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">{t("messages.tagNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="page h-full" id="edit-tag">
      <EditTagForm tag={tag} />
    </div>
  );
};

export default EditTag;
