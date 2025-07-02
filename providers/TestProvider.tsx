"use client";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "./ReactQueryProvider";
import VocabProvider from "./VocabProvider";
import useAuthStore from "@/store/auth.slice";

const TestProvider = ({ children }: any) => {
  const { Organization } = useAuthStore();
  return (
    <ReactQueryProvider key={Organization?.id}>
      <VocabProvider>{children}</VocabProvider>
      <Toaster />
    </ReactQueryProvider>
  );
};

export default TestProvider;
