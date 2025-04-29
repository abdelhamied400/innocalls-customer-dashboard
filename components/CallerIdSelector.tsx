import useVocabStore from "@/store/vocab.slice";
import Select from "./ui/select";
import { Button } from "./ui/button";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import PlusIcon from "@mui/icons-material/Add";
import { ControllerRenderProps } from "react-hook-form";
import { Country } from "@/types/api/country";
import { useMemo } from "react";
import { generateUUID } from "@/lib/utils";
import { Did } from "@/types/api/did";

type CallerId = {
  id: string;
  destination: string;
  callerId: string;
};

const CallerIdRow = ({
  callerId,
  index,
  countries,
  dids,
  onCountryChange,
  onDidChange,
  onDelete,
}: {
  callerId: CallerId;
  index: number;
  countries: Country[];
  dids: Did[];
  onCountryChange: (index: number, country: Country) => void;
  onDidChange: (index: number, did: Did) => void;
  onDelete: (index: number) => void;
}) => {
  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === callerId.destination) ?? null,
    [callerId.destination, countries]
  );

  const selectedDid = useMemo(
    () => dids.find((d) => d.id === callerId.callerId) ?? null,
    [callerId.callerId, dids]
  );

  return (
    <div
      className="call-id bg-gray-50 border border-gray-100 p-4 rounded-lg flex gap-2 items-center"
      key={`callerId-${index}`}
    >
      <Select
        label="Country"
        options={countries}
        value={selectedCountry}
        onChange={(country) => {
          if (country) onCountryChange(index, country);
        }}
        placeholder="Select a country..."
        getOptionLabel={(option) => `${option.emoji} ${option.name}`}
        getOptionValue={(option) => option.code}
      />
      <Select
        label="Did"
        options={dids}
        value={selectedDid}
        onChange={(did) => {
          if (did) onDidChange(index, did);
        }}
        placeholder="Select a did..."
      />

      <Button
        variant="ghost-destructive"
        size="icon"
        className="px-3"
        type="button"
        onClick={() => onDelete(index)}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
};

type CallerIdSelectorProps = ControllerRenderProps<
  {
    callerIds: CallerId[];
  },
  "callerIds"
>;

const CallerIdSelector = ({
  onChange,
  value: callerIds,
}: CallerIdSelectorProps) => {
  const { countries, dids } = useVocabStore();

  const onCountryChange = (index: number, country: Country) => {
    const updatedCallerIds = [...callerIds];
    updatedCallerIds[index] = {
      ...updatedCallerIds[index],
      destination: country.code,
    };
    onChange(updatedCallerIds);
  };

  const onDidChange = (index: number, did: Did) => {
    const updatedCallerIds = [...callerIds];
    updatedCallerIds[index] = {
      ...updatedCallerIds[index],
      callerId: did.id,
    };
    onChange(updatedCallerIds);
  };

  const onDeleteCallerId = (index: number) => {
    const updatedCallerIds = [...callerIds];
    updatedCallerIds.splice(index, 1);
    onChange(updatedCallerIds);
  };

  const onAddCallerId = () => {
    const newCallerId: CallerId = {
      id: generateUUID(),
      destination: "",
      callerId: "",
    };
    const updatedCallerIds = [...callerIds, newCallerId];
    onChange(updatedCallerIds);
  };

  return (
    <div className="w-full caller-ids">
      {callerIds.map((callerId, index) => (
        <CallerIdRow
          key={callerId.id}
          callerId={callerId}
          index={index}
          countries={countries}
          dids={dids}
          onCountryChange={onCountryChange}
          onDidChange={onDidChange}
          onDelete={onDeleteCallerId}
        />
      ))}

      <Button variant="link" onClick={onAddCallerId} type="button">
        <PlusIcon />
        Add Caller
      </Button>
    </div>
  );
};

export default CallerIdSelector;
