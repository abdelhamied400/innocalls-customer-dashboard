import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import Select from "./Select";
import PlusIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { CallBridgeStep1 } from "@/validation/CallBridgeCreate";
import { useVocab } from "@/hooks/useVocab";
import { useTranslations } from "@/providers/TranslationProvider";

type SelectOption = {
  label: string;
  value: string;
};

type CallBridgeCallerIdSelectorProps = {
  onChangeCallback?: () => void;
};

const CallBridgeCallerIdSelector = ({
  onChangeCallback,
}: CallBridgeCallerIdSelectorProps = {}) => {
  const t = useTranslations("common.callerIdSelector");
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CallBridgeStep1>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "callers",
  });

  const callers = watch("callers");
  const { countries, dids } = useVocab();

  const addCaller = () => {
    append({ destination: "", callerNumber: "" });
    onChangeCallback?.();
  };

  const selectedCountries = callers.map((item) => item.destination).filter(Boolean);

  const countryOptions = countries.map((country) => ({
    label: `${country.emoji} ${country.name}`,
    value: country.code,
  }));

  const didOptions: SelectOption[] = dids.map((did) => ({
    label: did.name,
    value: did.id,
  }));

  return (
    <div className="w-full caller-ids space-y-2">
      {fields.map((field, index) => {
        const currentDestination = callers[index]?.destination;
        const currentCallerId = callers[index]?.callerNumber;

        const availableCountryOptions = countryOptions.filter(
          (option) =>
            option.value === currentDestination ||
            !selectedCountries.includes(option.value),
        );

        const fieldErrors = errors.callers?.[index];
        const shouldShowRemove = callers.length > 1;

        return (
          <div
            key={field.id}
            className="call-id bg-gray-50 border border-gray-100 p-4 rounded-lg flex items-center gap-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-2">
              <Select<SelectOption, false>
                label={t("country.label")}
                options={availableCountryOptions}
                menuPlacement="bottom"
                value={
                  currentDestination
                    ? countryOptions.find((opt) => opt.value === currentDestination) || null
                    : null
                }
                onChange={(option) => {
                  setValue(`callers.${index}.destination`, option?.value || "", {
                    shouldValidate: true,
                  });
                  onChangeCallback?.();
                }}
                placeholder={t("country.placeholder")}
                error={fieldErrors?.destination?.message}
              />

              <Select<SelectOption, false>
                label={t("DID.label")}
                options={didOptions}
                menuPlacement="bottom"
                value={
                  currentCallerId
                    ? didOptions.find((opt) => opt.value === currentCallerId) || null
                    : null
                }
                onChange={(option) => {
                  setValue(`callers.${index}.callerNumber`, option?.value || "", {
                    shouldValidate: true,
                  });
                  onChangeCallback?.();
                }}
                placeholder={t("DID.placeholder")}
                error={fieldErrors?.callerNumber?.message}
              />
            </div>

            {shouldShowRemove && (
              <Button
                variant="ghost-destructive"
                size="icon"
                className="px-3 mt-6"
                type="button"
                onClick={() => {
                  remove(index);
                  onChangeCallback?.();
                }}
              >
                <DeleteIcon />
              </Button>
            )}
          </div>
        );
      })}

      <Button variant="link" onClick={addCaller} type="button">
        <PlusIcon />
        {t("addCaller")}
      </Button>
    </div>
  );
};

export default CallBridgeCallerIdSelector;
