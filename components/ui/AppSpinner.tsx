import { cn } from "@/lib/utils";

type AppSpinnerProps = {
  className?: string;
};
const AppSpinner = ({ className }: AppSpinnerProps) => {
  return (
    <div className={cn("app-spinner w-24 py-4", className)}>
      <div className="square-holder h-full">
        <div className="square"></div>
      </div>
    </div>
  );
};

export default AppSpinner;
