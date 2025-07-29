import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
};
const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div className={cn("spinner w-24 py-4", className)}>
      <div className="square-holder h-full">
        <div className="square"></div>
      </div>
    </div>
  );
};

export default Spinner;
