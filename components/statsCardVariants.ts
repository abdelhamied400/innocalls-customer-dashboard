import { cva, VariantProps } from "class-variance-authority";

export const statsCardVariants = cva(
  "group p-4 shadow rounded-lg transition-all flex flex-col gap-2 hover:shadow-lg text-gray-800",
  {
    variants: {
      variant: {
        default: "bg-white border-t-4 border-transparent",
        compound: "shadow-none hover:shadow-none border bg-gradient-to-b",
        subtle: "bg-gray-50 shadow-none hover:shadow-none",
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
        className: "border-gray-100 hover:border-gray-500",
      },
      {
        variant: "default",
        color: "primary",
        className: "border-primary-100 hover:border-primary-500",
      },
      {
        variant: "default",
        color: "warning",
        className: "border-amber-100 hover:border-amber-500",
      },
      {
        variant: "default",
        color: "destructive",
        className: "border-destructive-100 hover:border-destructive-500",
      },
      {
        variant: "default",
        color: "success",
        className: "border-success-100 hover:border-success-500",
      },
      {
        variant: "default",
        color: "info",
        className: "border-indigo-100 hover:border-indigo-500",
      },
      {
        variant: "compound",
        color: "primary",
        className:
          "from-primary-100/0 to-primary-100/50 hover:from-primary-100/20 hover:to-primary-100/70 hover:border-primary-500",
      },
      {
        variant: "compound",
        color: "warning",
        className:
          "from-amber-100/0 to-amber-100/50 hover:from-amber-100/20 hover:to-amber-100/70 hover:border-amber-500",
      },
      {
        variant: "compound",
        color: "destructive",
        className:
          "from-destructive-100/0 to-destructive-100/50 hover:from-destructive-100/20 hover:to-destructive-100/70 hover:border-destructive-500",
      },
      {
        variant: "compound",
        color: "info",
        className:
          "from-indigo-100/0 to-indigo-100/50 hover:from-indigo-100/20 hover:to-indigo-100/70 hover:border-indigo-500",
      },
      {
        variant: "compound",
        color: "success",
        className:
          "from-success-100/0 to-success-100/50 hover:from-success-100/20 hover:to-success-100/70 hover:border-success-500",
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

export const statsCardIconVariants = cva(
  "transition-colors rounded-full p-1 w-8 h-8 flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "",
        subtle: "rounded-lg",
        compound: "",
      },
      color: {
        default:
          "bg-gray-100 text-gray-500 group-hover:bg-gray-500 group-hover:text-white",
        primary:
          "bg-primary-200 text-primary-600 group-hover:bg-primary-500 group-hover:text-white",
        warning:
          "bg-amber-100 text-amber-500 group-hover:bg-amber-500 group-hover:text-white",
        destructive:
          "bg-destructive-100 text-destructive-500 group-hover:bg-destructive-500 group-hover:text-white",
        success:
          "bg-success-100 text-success-500 group-hover:bg-success-500 group-hover:text-white",
        info: "bg-indigo-100 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

export type StatsCardVariants = VariantProps<typeof statsCardVariants>;
