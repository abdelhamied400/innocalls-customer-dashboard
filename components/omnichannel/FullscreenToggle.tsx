import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import useAppStore from "@/store/app.slice";
import { useMemo } from "react";
import { useTranslations } from "@/providers/TranslationProvider";

const FullscreenToggle = () => {
  const t = useTranslations("omnichannel");
  const { isSidebarOpen, setSidebarOpen, isWebrtcOpen, setWebrtcOpen } =
    useAppStore();
  const isFullscreen = useMemo(
    () => !isSidebarOpen && !isWebrtcOpen,
    [isSidebarOpen, isWebrtcOpen],
  );

  const enterFullscreen = () => {
    setSidebarOpen(false);
    setWebrtcOpen(false);
  };

  const exitFullscreen = () => {
    setSidebarOpen(true);
    setWebrtcOpen(true);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={isFullscreen ? exitFullscreen : enterFullscreen}
      className="gap-1.5 rounded-lg text-xs h-8 border-gray-200 text-gray-500 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all"
    >
      {isFullscreen ? (
        <>
          <FullscreenExit className="text-base!" />
          {t("exitFullscreen")}
        </>
      ) : (
        <>
          <Fullscreen className="text-base!" />
          {t("fullscreen")}
        </>
      )}
    </Button>
  );
};

export default FullscreenToggle;
