"use client";
import Dropzone, {
  DropzoneTrigger,
  DropzoneFileList,
} from "@/components/ui/dropzone";
import { useFormContext } from "react-hook-form";

const CampaignDetailsForm = () => {
  const { register } = useFormContext();

  return (
    <Dropzone options={{ accept: { "audio/mp3": [".mp3"] }, maxSize: 70000 }}>
      <DropzoneTrigger />
      <DropzoneFileList />
    </Dropzone>
  );
};

export default CampaignDetailsForm;
