import { PropsWithChildren } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import NextIntlProvider from "./NextIntlProvider";
import { SessionProvider } from "next-auth/react";
import VocabProvider from "./VocabProvider";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = async ({ children }: MainProviderProps) => {
  return (
    <SessionProvider>
      <NextIntlProvider>
        <ReactQueryProvider>
          <VocabProvider>{children}</VocabProvider>
          <Toaster />
        </ReactQueryProvider>
      </NextIntlProvider>
    </SessionProvider>
  );
};

export default MainProvider;
