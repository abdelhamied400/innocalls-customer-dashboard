// components/CallerIdSelector.tsx
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { generateUUID } from "@/lib/utils";
import { Button } from "../ui/button";
import PlusIcon from "@mui/icons-material/Add";
import CallerIdRow from "./CallerIdRow";
import { AutoDialerCreateStep2 } from "@/validation/AutoDialerCreateCampaign";
import { useVocab } from "@/hooks/useVocab";

const CallerIdSelector = () => {
  const { control, watch } = useFormContext<AutoDialerCreateStep2>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "callerIds",
  });

  const callerIds = watch("callerIds");
  const { countries, dids } = useVocab();

  const availableCountryOptions = useMemo(() => {
    const selectedCodes = new Set(callerIds.map((c: any) => c.destination));
    return countries.filter((country) => !selectedCodes.has(country.code));
  }, [countries, callerIds]);

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
        const countriesForThisRow = [
          ...availableCountryOptions,
          ...countries.filter((c) => c.code === field.destination),
        ];

        return (
          <CallerIdRow
            key={field.id}
            index={index}
            countries={countriesForThisRow}
            dids={dids}
            remove={remove}
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
