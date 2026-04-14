import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import useAppStore from "@/store/app.slice";
import { useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";

const FullscreenToggle = () => {
  const t = useTranslations("omnichannel");
  const { isSidebarOpen, toggleSidebar, isWebrtcOpen, setWebrtcOpen } =
    useAppStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prevSidebarState, setPrevSidebarState] = useState(true);
  const [prevWebrtcState, setPrevWebrtcState] = useState(true);

  const enterFullscreen = () => {
    setPrevSidebarState(isSidebarOpen);
    setPrevWebrtcState(isWebrtcOpen);
    if (isSidebarOpen) toggleSidebar();
    if (isWebrtcOpen) setWebrtcOpen(false);
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (prevSidebarState && !isSidebarOpen) toggleSidebar();
    if (prevWebrtcState && !isWebrtcOpen) setWebrtcOpen(true);
    setIsFullscreen(false);
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
          <FullscreenExit className="!text-base" />
          {t("exitFullscreen")}
        </>
      ) : (
        <>
          <Fullscreen className="!text-base" />
          {t("fullscreen")}
        </>
      )}
    </Button>
  );
};

export default FullscreenToggle;
