// components/CallerIdRow.tsx
import { memo } from "react";
import { Button } from "../ui/button";
import Select from "../select";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Country } from "@/types/api/country";
import { Did } from "@/types/api/did";

type Props = {
  countries: Country[];
  dids: Did[];
  selectedCountry: Country | null;
  selectedDid: Did | null;
  onCountryChange: (country: Country | null) => void;
  onDidChange: (did: Did | null) => void;
  onRemove: () => void;
  countryError?: string;
  didError?: string;
};

/**
 * Dumb/Presentational Component
 * Renders a single caller ID row with country and DID selects
 */
const CallerIdRow = memo(
  ({
    countries,
    dids,
    selectedCountry,
    selectedDid,
    onCountryChange,
    onDidChange,
    onRemove,
    countryError,
    didError,
  }: Props) => {
    return (
      <div className="call-id bg-gray-50 border border-gray-100 p-4 rounded-lg flex items-center gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-2">
          <div className="flex flex-col gap-1">
            <Select
              label="Country"
              options={countries}
              value={selectedCountry}
              onChange={(country: Country | Country[] | null) => {
                if (country && !Array.isArray(country)) {
                  onCountryChange(country);
                } else if (country === null) {
                  onCountryChange(null);
                }
              }}
              placeholder="Select a country..."
              getLabel={(option) => `${option.emoji} ${option.name}`}
              getValue={(option) => option.code}
            />
            {countryError && (
              <p className="text-sm text-destructive mt-1">{countryError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Select
              label="DID"
              options={dids}
              value={selectedDid}
              onChange={(did: Did | Did[] | null) => {
                if (did && !Array.isArray(did)) {
                  onDidChange(did);
                } else if (did === null) {
                  onDidChange(null);
                }
              }}
              placeholder="Select a DID..."
              getLabel={(option) => option.name}
              getValue={(option) => option.id}
            />
            {didError && (
              <p className="text-sm text-destructive mt-1">{didError}</p>
            )}
          </div>
        </div>

        <Button
          variant="ghost-destructive"
          size="icon"
          className="px-3 mt-6"
          type="button"
          onClick={onRemove}
        >
          <DeleteIcon />
        </Button>
      </div>
    );
  }
);

CallerIdRow.displayName = "CallerIdRow";

export default CallerIdRow;
