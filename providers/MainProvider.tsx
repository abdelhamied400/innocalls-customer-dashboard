import { PropsWithChildren } from "react";
import { TranslationProvider } from "./TranslationProvider";
import { SessionProvider } from "next-auth/react";
import ClientProvider from "./ClientProvider";
import { WebrtcProvider } from "./webrtc/WebrtcProvider";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = async ({ children }: MainProviderProps) => {
  return (
    <SessionProvider>
      <TranslationProvider>
        <ClientProvider>
          <WebrtcProvider>{children}</WebrtcProvider>
        </ClientProvider>
      </TranslationProvider>
    </SessionProvider>
  );
};

export default MainProvider;
