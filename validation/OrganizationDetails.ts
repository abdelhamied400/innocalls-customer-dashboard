import z from "zod";

export const OrganizationDetailsSchema = z.object({
  organizationName: z.string().trim().min(1, "Organization name is required"),
});

export type OrganizationDetailsFormValues = z.infer<
  typeof OrganizationDetailsSchema
>;
