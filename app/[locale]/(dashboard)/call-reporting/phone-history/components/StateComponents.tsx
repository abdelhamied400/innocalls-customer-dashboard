import { ErrorMessageProps } from "../types";

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500" />
  </div>
);

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="py-8 text-center text-red-600">{message}</div>
);

export const EmptyState = () => (
  <div className="py-8 text-center">No history found.</div>
);
