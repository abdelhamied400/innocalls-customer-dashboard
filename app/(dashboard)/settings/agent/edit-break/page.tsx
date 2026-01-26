"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import breakTypesService from "@/services/break-types.service";
import EditBreakForm from "./form";
import { useTranslations } from "@/providers/TranslationProvider";

const EditBreakPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const t = useTranslations("settings.agent.breaks.editBreak");

  const { data: breakType, isLoading } = useQuery({
    queryKey: ["break-type", id],
    queryFn: () => breakTypesService.getBreakType(id!),
    enabled: !!id,
  });

  if (!id) {
    return (
      <div className="p-4 text-center text-gray-500">
        {t("messages.breakNotFound")}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!breakType) {
    return (
      <div className="p-4 text-center text-gray-500">
        {t("messages.breakNotFound")}
      </div>
    );
  }

  return (
    <div className="page h-full" id="edit-break">
      <EditBreakForm breakType={breakType} />
    </div>
  );
};

export default EditBreakPage;
