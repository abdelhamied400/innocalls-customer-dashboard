"use client";

import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import organizationsService from "@/services/organizations.service";
import useAuthStore from "@/store/auth.slice";
import { Organization } from "@/types/api/organization";
import {
  OrganizationDetailsFormValues,
  OrganizationDetailsSchema,
} from "@/validation/OrganizationDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

const OrganizationDetailsForm = () => {
  const { Organization, setOrganization } = useAuthStore();
  const { toast } = useToast();
  const { update } = useSession();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<OrganizationDetailsFormValues>({
    resolver: zodResolver(OrganizationDetailsSchema),
    defaultValues: {
      organizationName: Organization?.name || "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await organizationsService.updateOrganizationName({
        name: data.organizationName,
      });
      setOrganization({
        ...Organization!,
        name: data.organizationName,
      });
      toast({
        title: "Success",
        description: "Organization name updated successfully.",
        variant: "success",
      });
      await update();
    } catch (error) {
      console.error("Failed to update organization name:", error);
    }
  });

  return (
    <div className="border p-4 rounded-lg">
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-2">
          <h4>Organization Info</h4>
        </div>
        <div className="col-span-3">
          <form onSubmit={onSubmit} className="space-y-4">
            <Field
              label="Organization Name"
              htmlFor="organizationName"
              error={errors.organizationName?.message}
            >
              <Input
                id="organizationName"
                placeholder="Enter organization name"
                variant="field"
                {...register("organizationName")}
              />
            </Field>
            <Button type="submit">Save Changes</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailsForm;
