import { cva, VariantProps } from "class-variance-authority";

export const statsCardVariants = cva(
  "group p-4 shadow rounded-lg transition-all flex flex-col gap-2 hover:shadow-lg text-gray-800",
  {
    variants: {
      variant: {
        default: "",
        ghost: "bg-white border-t-4 border-transparent",
      },
      color: {
        default: "",
        primary: "",
        warning: "",
        destructive: "",
        success: "",
        info: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        color: "default",
        className: "bg-white",
      },
      {
        variant: "default",
        color: "warning",
        className: "bg-amber-100",
      },
      {
        variant: "default",
        color: "destructive",
        className: "bg-destructive-100",
      },
      {
        variant: "default",
        color: "success",
        className: "bg-success-100",
      },
      {
        variant: "default",
        color: "info",
        className: "bg-indigo-100",
      },
      {
        variant: "ghost",
        color: "default",
        className: "border-gray-100 hover:border-gray-500",
      },
      {
        variant: "ghost",
        color: "primary",
        className: "border-primary-100 hover:border-primary-500",
      },
      {
        variant: "ghost",
        color: "warning",
        className: "border-amber-100 hover:border-amber-500",
      },
      {
        variant: "ghost",
        color: "destructive",
        className: "border-destructive-100 hover:border-destructive-500",
      },
      {
        variant: "ghost",
        color: "success",
        className: "border-success-100 hover:border-success-500",
      },
      {
        variant: "ghost",
        color: "info",
        className: "border-indigo-100 hover:border-indigo-500",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  }
);

export const statsCardValueVariants = cva(
  "font-bold text-2xl text-gray-800 transition-colors",
  {
    variants: {
      color: {
        default: "group-hover:text-gray-800",
        primary: "group-hover:text-primary-500",
        warning: "group-hover:text-amber-500",
        destructive: "group-hover:text-destructive-500",
        success: "group-hover:text-success-500",
        info: "group-hover:text-indigo-500",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);
export const statsCardInfoVariants = cva(
  "text-xs text-gray-800 transition-colors",
  {
    variants: {
      color: {
        default: "text-gray-800",
        primary: "text-primary-500",
        warning: "text-amber-500",
        destructive: "text-destructive-500",
        success: "text-success-500",
        info: "text-indigo-500",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

export const statsCardIconVariants = cva("transition-colors rounded-full p-1", {
  variants: {
    color: {
      default: "bg-gray-100 group-hover:bg-gray-500 group-hover:text-white",
      primary:
        "bg-primary-100 group-hover:bg-primary-500 group-hover:text-white",
      warning: "bg-amber-100 group-hover:bg-amber-500 group-hover:text-white",
      destructive:
        "bg-destructive-100 group-hover:bg-destructive-500 group-hover:text-white",
      success:
        "bg-success-100 group-hover:bg-success-500 group-hover:text-white",
      info: "bg-indigo-100 group-hover:bg-indigo-500 group-hover:text-white",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export type StatsCardVariants = VariantProps<typeof statsCardVariants>;
