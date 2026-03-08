import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

const VALID_HOST_REGEX =
  /^(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;

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

export const WebrtcCredentialSchema = (
  t: ReturnType<typeof useTranslations>,
) =>
  z.object({
    domains: z
      .array(
        z
          .string()
          .trim()
          .min(1, t("credentialDialog.validation.domainRequired"))
          .url({ message: t("credentialDialog.validation.domainInvalid") })
          .refine((val) => isValidDomain(val), {
            message: t("credentialDialog.validation.domainInvalid"),
          }),
      )
      .min(1, t("credentialDialog.validation.domainMin"))
      .refine(
        (domains) => {
          const lower = domains.map((d) => d.trim().toLowerCase());
          return new Set(lower).size === lower.length;
        },
        { message: t("credentialDialog.validation.domainDuplicate") },
      ),
  });

export type WebrtcCredentialFormValues = z.infer<
  ReturnType<typeof WebrtcCredentialSchema>
>;
