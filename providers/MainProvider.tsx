import { PropsWithChildren } from "react";
import ReactQueryProvider from "./ReactQueryProvider";

type MainProviderProps = PropsWithChildren<object>;
const MainProvider = ({ children }: MainProviderProps) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default MainProvider;
