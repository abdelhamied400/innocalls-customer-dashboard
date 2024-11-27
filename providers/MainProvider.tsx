import { PropsWithChildren } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = ({ children }: MainProviderProps) => {
  return (
    <>
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <Toaster />
    </>
  );
};

export default MainProvider;
