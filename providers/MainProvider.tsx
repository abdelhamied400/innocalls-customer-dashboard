import { PropsWithChildren } from "react";
import NextIntlProvider from "./NextIntlProvider";
import { SessionProvider } from "next-auth/react";
import ClientProvider from "./ClientProvider";
import { WebrtcProvider } from "./webrtc/WebrtcProvider";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = async ({ children }: MainProviderProps) => {
  return (
    <SessionProvider>
      <NextIntlProvider>
        <ClientProvider>
          <WebrtcProvider>{children}</WebrtcProvider>
        </ClientProvider>
      </NextIntlProvider>
    </SessionProvider>
  );
};

export default MainProvider;
