"use client";
import { Button } from "@/components/ui/button";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";

const CallDetailsForm = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="field">
        <h3>Sound</h3>
        <Dropzone
          options={{ accept: { "audio/mp3": [".mp3"] }, maxSize: 70000 }}
        >
          <DropzoneTrigger />
          <DropzoneFileList />
        </Dropzone>
      </div>
      <Button size="lg">Next</Button>
    </div>
  );
};

export default CallDetailsForm;
