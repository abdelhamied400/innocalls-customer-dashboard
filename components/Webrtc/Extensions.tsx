import { useSip } from "@/providers/webrtc/SipProvider";
import webrtcService from "@/services/webrtc.service";
import useVocabStore from "@/store/vocab.slice";
import { Extension } from "@/types/api/extension";
import ExtensionRow from "./Extensions/ExtensionRow";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Extensions = () => {
  const { extensions } = useVocabStore();
  const { login } = useSip();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onExtensionLogin = async (extension: Extension) => {
    try {
      setLoading(true);
      const credentials = await webrtcService.getExtension(extension.id);
      login({
        ...extension,
        uri: credentials.agent.uri,
        password: credentials.agent.password,
      });
    } catch (error) {
      console.error("Error during extension login:", error);
      toast({
        title: "Error",
        description: "Failed to login to extension. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="extensions flex flex-col gap-2">
      {extensions?.map((extension) => (
        <ExtensionRow
          key={extension.id}
          extension={extension}
          onClick={() => onExtensionLogin(extension)}
          disabled={extension.status === "disabled" || loading}
        />
      ))}
    </div>
  );
};

export default Extensions;
