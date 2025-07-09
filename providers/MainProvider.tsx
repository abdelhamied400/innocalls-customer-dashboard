import { PropsWithChildren } from "react";
import NextIntlProvider from "./NextIntlProvider";
import { SessionProvider } from "next-auth/react";
import ClientProvider from "./ClientProvider";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = async ({ children }: MainProviderProps) => {
  return (
    <SessionProvider>
      <NextIntlProvider>
        <ClientProvider>{children}</ClientProvider>
      </NextIntlProvider>
    </SessionProvider>
  );
};

export default MainProvider;
