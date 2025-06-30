import Digits from "./Shared/Digits";
import DialpadActions from "./Dialpad/DialpadActions";
import DialpadInput from "./Dialpad/DialpadInput";
import ExtensionStateBar from "./Shared/ExtensionStateBar";

const Dialpad = () => {
  return (
    <div className="dialpad">
      <div className="flex flex-col gap-4">
        <DialpadInput />
        <Digits />
        <DialpadActions />
      </div>
    </div>
  );
};

export default Dialpad;
