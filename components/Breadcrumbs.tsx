import { useTranslations } from "@/providers/TranslationProvider";

const Breadcrumbs = () => {
  return (
    <div className="flex gap-2 bg-blue-300 breadcrumbs">
      <BreadcrumbItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem />
    </div>
  );
};

const BreadcrumbItem = () => {
  const t = useTranslations("components.breadcrumbs");

  return (
    <div className="bg-blue-400 breadcrumb-item">
      <p>{t("item")}</p>
    </div>
  );
};

const BreadcrumbSeparator = () => {
  return (
    <div className="breadcrumb-separator">
      <p>||</p>
    </div>
  );
};

export default Breadcrumbs;
