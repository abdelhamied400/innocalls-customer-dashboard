import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

export const API_CREDENTIAL_SERVICES = [
  "pbx",
  "order-confirmation",
  "call-campaign",
  "web-call",
  "auto-dialer-campaign",
  "billing",
] as const;

export const CreateApiCredentialSchema = (
  t: ReturnType<typeof useTranslations>,
) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, t("credentialDialog.validation.titleRequired"))
      .min(2, t("credentialDialog.validation.titleMin"))
      .max(250, t("credentialDialog.validation.titleMax")),
    services: z
      .array(z.string())
      .min(1, t("credentialDialog.validation.servicesMin")),
  });

export const UpdateApiCredentialSchema = (
  t: ReturnType<typeof useTranslations>,
) =>
  z.object({
    services: z
      .array(z.string())
      .min(1, t("credentialDialog.validation.servicesMin")),
  });

export type CreateApiCredentialFormValues = z.infer<
  ReturnType<typeof CreateApiCredentialSchema>
>;

export type UpdateApiCredentialFormValues = z.infer<
  ReturnType<typeof UpdateApiCredentialSchema>
>;
