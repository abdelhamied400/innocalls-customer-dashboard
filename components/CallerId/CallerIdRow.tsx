// components/CallerIdRow.tsx
import { memo } from "react";
import { Button } from "../ui/button";
import Select from "../Select";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Country } from "@/types/api/country";
import { Did } from "@/types/api/did";

type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  countries: Country[];
  dids: Did[];
  selectedCountryCode: string;
  selectedDidId: string;
  onCountryChange: (countryCode: string) => void;
  onDidChange: (didId: string) => void;
  onRemove: () => void;
  countryError?: string;
  didError?: string;
  shouldShowRemove: boolean;
};

/**
 * Dumb/Presentational Component
 * Renders a single caller ID row with country and DID selects
 */
const CallerIdRow = memo(
  ({
    countries,
    dids,
    selectedCountryCode,
    selectedDidId,
    onCountryChange,
    onDidChange,
    onRemove,
    countryError,
    didError,
    shouldShowRemove,
  }: Props) => {
    const countryOptions: SelectOption[] = countries.map((country) => ({
      label: country.name,
      value: country.code,
    }));

    const didOptions: SelectOption[] = dids.map((did) => ({
      label: did.name,
      value: did.id,
    }));

    const selectedCountryOption =
      countryOptions.find((opt) => opt.value === selectedCountryCode) || null;

    const selectedDidOption =
      didOptions.find((opt) => opt.value === selectedDidId) || null;

    return (
      <div className="call-id bg-gray-50 border border-gray-100 p-4 rounded-lg flex items-center gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-2">
          <Select
            label="Country"
            options={countryOptions}
            value={selectedCountryOption}
            onChange={(option) => {
              const value = Array.isArray(option)
                ? option[0]?.value
                : option?.value;
              onCountryChange(value || "");
            }}
            placeholder="Select a country..."
            error={countryError}
          />

          <Select
            label="DID"
            options={didOptions}
            value={selectedDidOption}
            onChange={(option) => {
              const value = Array.isArray(option)
                ? option[0]?.value
                : option?.value;
              onDidChange(value || "");
            }}
            placeholder="Select a DID..."
            error={didError}
          />
        </div>

        {shouldShowRemove && (
          <Button
            variant="ghost-destructive"
            size="icon"
            className="px-3 mt-6"
            type="button"
            onClick={onRemove}
          >
            <DeleteIcon />
          </Button>
        )}
      </div>
    );
  }
);

CallerIdRow.displayName = "CallerIdRow";

export default CallerIdRow;
