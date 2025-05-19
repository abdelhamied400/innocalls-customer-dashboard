import Image from "next/image";
import { cn } from "@/lib/utils"; // optional if you use className merging

const FeatureCard = ({
  title,
  description,
  image,
  className,
  isActive,
}: any) => {
  return (
    <div
      className={cn(
        "bg-white text-black rounded-2xl shadow-lg px-5 py-3 flex flex-col gap-4 select-none scale-90",
        isActive && "scale-100 transition-transform duration-500 ease-in-out",
        className
      )}
    >
      {/* background: #FFFFFF;
background: linear-gradient(180deg, #2021AD 0%, rgba(46, 65, 211, 0.0104167) 99.99%, rgba(80, 80, 230, 0) 100%); */}

      {/* Icon section */}
      <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-b from-[#2021AD] to-[#2e41d303]">
        <Image
          src={image}
          alt={title}
          width={24}
          height={24}
          className="object-contain"
        />
      </div>

      <div className="space-y-2">
        <h3 className={cn("font-bold", isActive && "text-lg")}>{title}</h3>
        <p className={cn("text-gray-600", !isActive && "text-xs")}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
