import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Extension } from "@/types/api/extension";
import { useState } from "react";

type ExtensionRowProps = {
  extension: Extension;
  disabled?: boolean;
  onClick?: () => Promise<void>;
};
const ExtensionRow = ({ extension, disabled, onClick }: ExtensionRowProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (onClick) {
      setLoading(true);
      try {
        await onClick();
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
    }
  };

  return (
    <Button
      key={extension.id}
      variant="ghost"
      className="h-auto py-4"
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading && <Spinner />}
      {extension.name} ({extension.ext})
    </Button>
  );
};

export default ExtensionRow;
