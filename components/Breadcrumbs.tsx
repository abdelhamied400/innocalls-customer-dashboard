import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  disabled?: boolean;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItemComponent item={item} />
        </span>
      ))}
    </nav>
  );
};

const BreadcrumbItemComponent = ({ item }: { item: BreadcrumbItem }) => {
  if (item.disabled || !item.href) {
    return <span className="">{item.label}</span>;
  }

  return (
    <Link href={item.href} className="text-primary underline font-semibold">
      {item.label}
    </Link>
  );
};

const BreadcrumbSeparator = () => {
  return (
    <span className="text-muted-foreground/40">
      <ArrowForwardIos className="rtl:rotate-180" sx={{ fontSize: 12 }} />
    </span>
  );
};

export default Breadcrumbs;
