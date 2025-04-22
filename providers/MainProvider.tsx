import { PropsWithChildren } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import NextIntlProvider from "./NextIntlProvider";
import { SessionProvider } from "next-auth/react";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = async ({ children }: MainProviderProps) => {
  return (
    <SessionProvider>
      <NextIntlProvider>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </NextIntlProvider>
    </SessionProvider>
  );
};

export default MainProvider;
