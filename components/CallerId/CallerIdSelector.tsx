// components/CallerIdSelector.tsx
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { generateUUID } from "@/lib/utils";
import { Button } from "../ui/button";
import PlusIcon from "@mui/icons-material/Add";
import CallerIdRow from "./CallerIdRow";
import { AutoDialerCreateStep2 } from "@/validation/AutoDialerCreateCampaign";
import { useVocab } from "@/hooks/useVocab";
import { Country } from "@/types/api/country";
import { Did } from "@/types/api/did";

/**
 * Smart/Container Component
 * Manages state and react-hook-form integration for caller IDs
 */
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
  const availableCountryOptions = useMemo(() => {
    const selectedCodes = new Set(
      callerIds?.map((c: { destination: string }) => c.destination) || []
    );
    return countries.filter((country) => !selectedCodes.has(country.code));
  }, [countries, callerIds]);

  const addCaller = () => {
    append({
      id: generateUUID(),
      destination: "",
      callerId: "",
    });
  };

  const handleCountryChange = (index: number, country: Country | null) => {
    setValue(`callerIds.${index}.destination`, country?.code || "", {
      shouldValidate: true,
    });
  };

  const handleDidChange = (index: number, did: Did | null) => {
    setValue(`callerIds.${index}.callerId`, did?.id || "", {
      shouldValidate: true,
    });
  };

  return (
    <div className="w-full caller-ids space-y-2">
      {fields.map((field, index) => {
        // Watch the current values for this specific row
        const currentDestination = watch(`callerIds.${index}.destination`);
        const currentCallerId = watch(`callerIds.${index}.callerId`);

        // Include available countries + the currently selected country for this row
        const countriesForThisRow = [
          ...availableCountryOptions,
          ...countries.filter((c) => c.code === currentDestination),
        ];

        const selectedCountry =
          countries.find((c) => c.code === currentDestination) || null;
        const selectedDid = dids.find((d) => d.id === currentCallerId) || null;

        const fieldErrors = errors.callerIds?.[index];
        const countryError = fieldErrors?.destination?.message;
        const didError = fieldErrors?.callerId?.message;

        return (
          <CallerIdRow
            key={field.id}
            countries={countriesForThisRow}
            dids={dids}
            selectedCountry={selectedCountry}
            selectedDid={selectedDid}
            onCountryChange={(country) => handleCountryChange(index, country)}
            onDidChange={(did) => handleDidChange(index, did)}
            onRemove={() => remove(index)}
            countryError={countryError}
            didError={didError}
            shouldShowRemove={callerIds.length > 1}
          />
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
