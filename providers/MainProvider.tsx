import { PropsWithChildren } from "react";
import { TranslationProvider } from "./TranslationProvider";
import ClientProvider from "./ClientProvider";
import { WebrtcProvider } from "./webrtc/WebrtcProvider";
import CustomSessionProvider from "./CustomSessionProvider";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = async ({ children }: MainProviderProps) => {
  return (
    <CustomSessionProvider>
      <TranslationProvider>
        <ClientProvider>
          <WebrtcProvider>{children}</WebrtcProvider>
        </ClientProvider>
      </TranslationProvider>
    </CustomSessionProvider>
  );
};

export default MainProvider;
