// components/CallerIdRow.tsx
import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import Select from "../ui/select";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Country } from "@/types/api/country";
import { Did } from "@/types/api/did";

type Props = {
  index: number;
  countries: Country[];
  dids: Did[];
  remove: (index: number) => void;
};

const CallerIdRow = memo(({ index, countries, dids, remove }: Props) => {
  const { control } = useFormContext();

  return (
    <div className="call-id bg-gray-50 border border-gray-100 p-4 rounded-lg flex gap-2 items-center">
      <FormField
        control={control}
        name={`callerIds.${index}.destination`}
        render={({ field }) => {
          const selectedCountry =
            countries.find((c) => c.code === field.value) ?? null;
          return (
            <FormItem className="flex-1">
              <FormControl>
                <Select
                  {...field}
                  label="Country"
                  options={countries}
                  value={selectedCountry}
                  onChange={(country) =>
                    country && field.onChange(country.code)
                  }
                  placeholder="Select a country..."
                  getLabel={(option) => `${option.emoji} ${option.name}`}
                  getValue={(option) => option.code}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={control}
        name={`callerIds.${index}.callerId`}
        render={({ field }) => {
          const selectedDid = dids.find((d) => d.id === field.value) ?? null;
          return (
            <FormItem className="flex-1">
              <FormControl>
                <Select
                  {...field}
                  label="DID"
                  options={dids}
                  value={selectedDid}
                  onChange={(did) => did && field.onChange(did.id)}
                  placeholder="Select a DID..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <Button
        variant="ghost-destructive"
        size="icon"
        className="px-3 mt-6"
        type="button"
        onClick={() => remove(index)}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
});

export default CallerIdRow;
