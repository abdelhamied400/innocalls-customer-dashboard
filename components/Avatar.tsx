import { cn } from "@/lib/utils";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  name: string;
};
const Avatar = ({ name, className, ...props }: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "avatar bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600",
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
};

export default Avatar;
