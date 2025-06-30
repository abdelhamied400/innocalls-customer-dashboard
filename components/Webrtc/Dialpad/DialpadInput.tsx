import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const DialpadInput = () => {
  return (
    <Field label="Number">
      <Input value={123} variant="field" />
    </Field>
  );
};

export default DialpadInput;
