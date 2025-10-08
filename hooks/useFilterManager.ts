import { useState } from "react";
import { z } from "zod";

export type FilterConfig<T> = {
  defaultValues: T;
  schema: z.ZodSchema<T>;
};

export const useFilterManager = <T extends Record<string, any>>(
  config: FilterConfig<T>
) => {
  const { defaultValues, schema } = config;

  const [values, setValues] = useState<T>(defaultValues);
  const [appliedValues, setAppliedValues] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    Object.keys(defaultValues).reduce((acc, key) => {
      acc[key as keyof T] = "";
      return acc;
    }, {} as Record<keyof T, string>)
  );

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  // apply multiple values at once
  const applyValues = (partialValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...partialValues }));
    setAppliedValues((prev) => ({ ...prev, ...partialValues }));
  };

  const reset = () => {
    setValues(defaultValues);
    setAppliedValues(defaultValues);
    setErrors(
      Object.keys(defaultValues).reduce((acc, key) => {
        acc[key as keyof T] = "";
        return acc;
      }, {} as Record<keyof T, string>)
    );
  };

  const apply = () => {
    // Clear previous errors
    setErrors(
      Object.keys(defaultValues).reduce((acc, key) => {
        acc[key as keyof T] = "";
        return acc;
      }, {} as Record<keyof T, string>)
    );

    const result = schema.safeParse(values);

    if (!result.success) {
      const zodIssuesToObject = (issues: z.ZodIssue[]) =>
        issues.reduce((acc, issue) => {
          if (issue.path.length === 1) {
            // Simple field
            const path = issue.path[0] as keyof T;
            acc[path] = issue.message;
          } else if (
            issue.path.length === 2 &&
            typeof issue.path[1] === "number"
          ) {
            // Array field, e.g., agents.0
            const arrayKey = issue.path[0] as keyof T;
            if (!Array.isArray(acc[arrayKey])) {
              acc[arrayKey] = [] as any;
            }
            (acc[arrayKey] as string[])[issue.path[1] as number] =
              issue.message;
          }
          // For deeper nesting, extend as needed
          return acc;
        }, {} as Record<keyof T, any>);

      const validationErrors = zodIssuesToObject(result.error.issues);
      setErrors(validationErrors);
      return false;
    }

    setAppliedValues(result.data);
    return true;
  };

  return {
    values,
    appliedValues,
    errors,
    setValue,
    reset,
    apply,
    applyValues,
  };
};
