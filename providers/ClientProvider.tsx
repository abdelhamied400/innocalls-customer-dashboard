"use client";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "./ReactQueryProvider";
import VocabProvider from "./VocabProvider";
import useAuthStore from "@/store/auth.slice";
import AuthProvider from "./AuthProvider";

const TestProvider = ({ children }: any) => {
  const { Organization } = useAuthStore();
  return (
    <ReactQueryProvider key={Organization?.id}>
      <AuthProvider>
        <VocabProvider>{children}</VocabProvider>
      </AuthProvider>
      <Toaster />
    </ReactQueryProvider>
  );
};

export default TestProvider;
