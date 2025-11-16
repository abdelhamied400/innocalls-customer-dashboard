// components/CallerIdSelector.tsx
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { generateUUID } from "@/lib/utils";
import { Button } from "../ui/button";
import Select from "../Select";
import PlusIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { AutoDialerCreateStep2 } from "@/validation/AutoDialerCreateCampaign";
import { useVocab } from "@/hooks/useVocab";

type SelectOption = {
  label: string;
  value: string;
};

const CallerIdSelector = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AutoDialerCreateStep2>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "callerIds",
  });

  const callerIds = watch("callerIds");
  const { countries, dids } = useVocab();

  // Calculate available countries (excluding already selected ones)
  const availableCountries = useMemo(() => {
    const selectedCodes = new Set(
      callerIds?.map((c) => c.destination).filter(Boolean) || []
    );
    return countries.filter((country) => !selectedCodes.has(country.code));
  }, [countries, callerIds]);

  const didOptions: SelectOption[] = useMemo(
    () => dids.map((did) => ({ label: did.name, value: did.id })),
    [dids]
  );

  const addCaller = () => {
    append({
      id: generateUUID(),
      destination: "",
      callerId: "",
    });
  };

  return (
    <div className="w-full caller-ids space-y-2">
      {fields.map((field, index) => {
        const currentDestination = watch(`callerIds.${index}.destination`);
        const currentCallerId = watch(`callerIds.${index}.callerId`);

        // Include available countries + the currently selected country for this row
        const countryOptions = countries.map((country) => ({
          label: `${country.emoji} ${country.name}`,
          value: country.code,
        }));
        const didOptions: SelectOption[] = dids.map((did) => ({
          label: did.name,
          value: did.id,
        }));

        const selectedCountryOption = currentDestination
          ? countryOptions.find((opt) => opt.value === currentDestination) ||
            null
          : null;

        const selectedDidOption = currentCallerId
          ? didOptions.find((opt) => opt.value === currentCallerId) || null
          : null;

        const fieldErrors = errors.callerIds?.[index];
        const shouldShowRemove = callerIds.length > 1;

        return (
          <div
            key={field.id}
            className="call-id bg-gray-50 border border-gray-100 p-4 rounded-lg flex items-center gap-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-2">
              <Select<SelectOption, false>
                label="Country"
                options={countryOptions}
                value={selectedCountryOption}
                onChange={(option) => {
                  const value = option?.value || "";
                  setValue(`callerIds.${index}.destination`, value, {
                    shouldValidate: true,
                  });
                }}
                placeholder="Select a country..."
                error={fieldErrors?.destination?.message}
              />

              <Select<SelectOption, false>
                label="DID"
                options={didOptions}
                value={selectedDidOption}
                onChange={(option) => {
                  const value = option?.value || "";
                  setValue(`callerIds.${index}.callerId`, value, {
                    shouldValidate: true,
                  });
                }}
                placeholder="Select a DID..."
                error={fieldErrors?.callerId?.message}
              />
            </div>

            {shouldShowRemove && (
              <Button
                variant="ghost-destructive"
                size="icon"
                className="px-3 mt-6"
                type="button"
                onClick={() => remove(index)}
              >
                <DeleteIcon />
              </Button>
            )}
          </div>
        );
      })}

      <Button variant="link" onClick={addCaller} type="button">
        <PlusIcon />
        Add Caller
      </Button>
    </div>
  );
};

export default CallerIdSelector;
