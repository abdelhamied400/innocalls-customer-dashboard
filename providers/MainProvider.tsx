import { PropsWithChildren } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import NextIntlProvider from "./NextIntlProvider";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = async ({ children }: MainProviderProps) => {
  return (
    <NextIntlProvider>
      <ReactQueryProvider>
        {children}
        <Toaster />
      </ReactQueryProvider>
    </NextIntlProvider>
  );
};

export default MainProvider;
