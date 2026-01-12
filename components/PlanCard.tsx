"use client";
import Check from "@mui/icons-material/Check";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";

type PlanCardProps = {
  title: string;
  price?: string;
  discount?: string;
  per?: "month" | "quarter" | "year";
  renderPricing?: React.ReactNode;
  renderActions?: React.ReactNode;
  subtitle: string;
  features: Array<string>;
};
const PlanCard = ({
  title,
  price,
  discount,
  per,
  renderPricing,
  subtitle,
  features,
  renderActions,
}: PlanCardProps) => {
  const t = useTranslations("common");
  return (
    <div className="plan-card bg-white border p-4 rounded-xl">
      <div className="flex flex-col gap-4 h-full">
        <h2 className="text-lg font-bold">{title}</h2>
        {renderPricing || (
          <div className="flex items-center gap-2">
            <h1
              className={cn(
                "text-2xl lg:text-4xl font-bold",
                discount ? "line-through text-gray-400" : ""
              )}
            >
              {price}{" "}
            </h1>
            <h1 className={cn("text-2xl lg:text-4xl font-bold")}>
              {discount}{" "}
            </h1>
            <div className="flex flex-col text-gray-300 text-xs">
              <p>{t("planCard.per.month")}</p>
              <p>
                {per === "month"
                  ? t("planCard.billed.monthly")
                  : t("planCard.billed.yearly")}
              </p>
            </div>
          </div>
        )}
        <p className="font-semibold mb-4 text-sm">{subtitle}</p>
        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-sm text-icons flex items-center gap-2"
            >
              <div className="bg-[#02D995] rounded-full w-6 h-6 flex items-center justify-center">
                <Check className="text-white w-4! h-4!" />
              </div>
              <span className="flex-1">{feature}</span>
            </div>
          ))}
        </div>

        <div className="actions w-3/4 mx-auto mt-auto">
          {renderActions || (
            <Button variant="outline" className="w-full py-4 rounded-full">
              {t("planCard.choosePlan")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
