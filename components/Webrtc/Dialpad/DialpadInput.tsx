import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSip } from "@/providers/webrtc/SipProvider";

const DialpadInput = () => {
  const { number } = useSip();

  return (
    <Field label="Number">
      <Input value={number} variant="field" />
    </Field>
  );
};

export default DialpadInput;
