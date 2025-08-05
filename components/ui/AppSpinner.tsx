import { cn } from "@/lib/utils";

type AppSpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
};

const AppSpinner = ({
  className,
  size = "md",
  variant = "spinner",
  color = "primary",
}: AppSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-current rounded-full animate-pulse",
                  size === "sm"
                    ? "w-1 h-1"
                    : size === "md"
                    ? "w-1.5 h-1.5"
                    : "w-2 h-2"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.4s",
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className={cn(
              "bg-current rounded-full animate-pulse",
              sizeClasses[size]
            )}
          />
        );

      case "spinner":
      default:
        return (
          <div
            className={cn(
              "border-2 border-current border-t-transparent rounded-full animate-spin",
              sizeClasses[size]
            )}
          />
        );
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        colorClasses[color],
        className
      )}
    >
      {renderSpinner()}
    </div>
  );
};

export default AppSpinner;
