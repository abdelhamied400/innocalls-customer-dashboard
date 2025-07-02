import { PropsWithChildren } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import NextIntlProvider from "./NextIntlProvider";
import { SessionProvider } from "next-auth/react";
import VocabProvider from "./VocabProvider";
import TestProvider from "./TestProvider";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = async ({ children }: MainProviderProps) => {
  return (
    <SessionProvider>
      <NextIntlProvider>
        <TestProvider>{children}</TestProvider>
      </NextIntlProvider>
    </SessionProvider>
  );
};

export default MainProvider;
