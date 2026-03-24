"use client";

import { PropsWithChildren, useEffect } from "react";
import useSessionStore from "@/store/session.slice";

type CustomSessionProviderProps = PropsWithChildren<object>;

const CustomSessionProvider = ({ children }: CustomSessionProviderProps) => {
  const { initSession } = useSessionStore();

  useEffect(() => {
    initSession();
  }, [initSession]);

  return <>{children}</>;
};

export default CustomSessionProvider;
