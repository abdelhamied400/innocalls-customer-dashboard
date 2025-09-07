import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowForward, Dialpad } from "@mui/icons-material";
import { PropsWithChildren } from "react";
import useAppStore from "@/store/app.slice";
import CallSummaryModal from "./Call/CallSummaryModal";

type InnortcLayoutProps = PropsWithChildren<object>;
const InnortcLayout = ({ children }: InnortcLayoutProps) => {
  const { isWebrtcOpen, setWebrtcOpen } = useAppStore();

  return (
    <div className="innortc-layout flex flex-col h-full">
      <div className="head border-b flex justify-center items-center">
        <Button
          variant="unstyled"
          className={cn(
            "[&_svg]:size-6 w-full p-6 h-auto transition-transform duration-400 ease-in-out",
            isWebrtcOpen ? "rotate-180" : "rotate-0"
          )}
          onClick={() => setWebrtcOpen(!isWebrtcOpen)}
        >
          <ArrowForward />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">{children}</div>

      <div className="foot border-t flex justify-center items-center">
        <Button
          variant="unstyled"
          className="[&_svg]:size-6 text-primary-500 w-full p-6 h-auto"
          onClick={() => setWebrtcOpen(!isWebrtcOpen)}
        >
          <Dialpad />
        </Button>
      </div>

      <CallSummaryModal />
    </div>
  );
};

export default InnortcLayout;
