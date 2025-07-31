import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import { FirstPage, LastPage } from "@mui/icons-material";
import { useLocale } from "next-intl";
import { locales, LocaleSlug } from "@/i18n/config";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row flex-wrap items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "pagination-active" : "pagination-ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

type PaginationButtonProps = {
  isActive?: boolean;
} & ButtonProps;

const PaginationButton = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationButtonProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    className={className}
    variant={isActive ? "pagination-active" : "pagination-ghost"}
    size={size}
    {...props}
  />
);
PaginationLink.displayName = "PaginationButton";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => {
  const locale = useLocale() as LocaleSlug;
  const { dir } = locales[locale];

  return (
    <PaginationButton
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      {dir === "rtl" ? (
        <LastPage className="w-4 h-4" />
      ) : (
        <FirstPage className="w-4 h-4" />
      )}
    </PaginationButton>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => {
  const locale = useLocale() as LocaleSlug;
  const { dir } = locales[locale];

  return (
    <PaginationButton
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      {dir === "rtl" ? (
        <FirstPage className="w-4 h-4" />
      ) : (
        <LastPage className="w-4 h-4" />
      )}
    </PaginationButton>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <EllipsisIcon className="w-4 h-4" />
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationButton,
};
