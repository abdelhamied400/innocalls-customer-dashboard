import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

const VALID_HOST_REGEX =
  /^((\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;

const isValidDomain = (value: string): boolean => {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (!url.hostname) return false;
    if (url.hash) return false;
    if (!VALID_HOST_REGEX.test(url.hostname)) return false;
    return true;
  } catch {
    return false;
  }
};

export const WebCallAppSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    iconText: z
      .string()
      .trim()
      .min(2, t("form.validation.iconTextMin"))
      .max(250, t("form.validation.iconTextMax")),
    iconBackgroundColor: z
      .string()
      .min(1, t("form.validation.colorRequired")),
    iconBaseColor: z
      .string()
      .min(1, t("form.validation.colorRequired")),
    iconFontColor: z
      .string()
      .min(1, t("form.validation.colorRequired")),
    concurrentCalls: z
      .number({ invalid_type_error: t("form.validation.concurrentCallsRequired") })
      .min(1, t("form.validation.concurrentCallsMin")),
    destinationNumber: z
      .string()
      .trim()
      .min(1, t("form.validation.destinationNumberRequired"))
      .regex(/^\d+$/, t("form.validation.destinationNumberDigits")),
    callerId: z
      .string()
      .min(1, t("form.validation.callerIdRequired")),
    domains: z
      .array(
        z
          .string()
          .trim()
          .min(1, t("form.validation.domainRequired"))
          .url({ message: t("form.validation.domainInvalid") })
          .refine((val) => isValidDomain(val), {
            message: t("form.validation.domainInvalid"),
          }),
      )
      .min(1, t("form.validation.domainMin"))
      .refine(
        (domains) => {
          const lower = domains.map((d) => d.trim().toLowerCase());
          return new Set(lower).size === lower.length;
        },
        { message: t("form.validation.domainDuplicate") },
      ),
  });

export type WebCallAppFormValues = z.infer<
  ReturnType<typeof WebCallAppSchema>
>;
