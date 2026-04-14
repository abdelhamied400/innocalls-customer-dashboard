import { cn } from "@/lib/utils";

type ContactAvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const ContactAvatar = ({
  name,
  size = "md",
  className,
}: ContactAvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold shrink-0 shadow-sm",
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  );
};

export default ContactAvatar;
