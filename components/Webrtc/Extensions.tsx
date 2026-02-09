import { useSip } from "@/providers/webrtc/SipProvider";
import webrtcService from "@/services/webrtc.service";
import { Extension } from "@/types/api/extension";
import ExtensionRow from "./Extensions/ExtensionRow";
import { useState } from "react";
import { toast } from "sonner";
import { useVocab } from "@/hooks/useVocab";

const Extensions = () => {
  const { extensions } = useVocab();
  const { login, setExtension } = useSip();
  const [loading, setLoading] = useState(false);

  const onExtensionLogin = async (extension: Extension) => {
    try {
      setLoading(true);
      const credentials = await webrtcService.getExtension(extension.id);
      setExtension(credentials.agent);
      login({
        ...extension,
        ...credentials.agent,
        uri: credentials.agent.uri,
        password: credentials.agent.password,
      });
    } catch (error) {
      console.error("Error during extension login:", error);
      toast.error("Error", {
        description: "Failed to login to extension. Please try again.",
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
