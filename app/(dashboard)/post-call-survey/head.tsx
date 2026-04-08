"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/providers/TranslationProvider";

type PostCallSurveyHeadProps = {
  name: string;
  onNameChange: (value: string) => void;
};

const PostCallSurveyHead = ({ name, onNameChange }: PostCallSurveyHeadProps) => {
  const t = useTranslations("postCallSurvey");
  const tCommon = useTranslations("common.search");

  return (
    <div className="flex flex-wrap items-center justify-between p-4">
      <h2>{t("title")}</h2>
      <div className="flex flex-wrap items-center gap-2">
        <Field preIcon={<SearchIcon />}>
          <Input
            variant="field"
            placeholder={tCommon("placeholder")}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            type="search"
          />
        </Field>
        <Button asChild>
          <Link href="/post-call-survey/create">
            {t("actions.create")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PostCallSurveyHead;
