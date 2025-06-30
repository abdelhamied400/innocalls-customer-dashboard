"use client";

import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";

type RouteKey = string;

type RoutingContextType = {
  route: RouteKey;
  navigate: (route: RouteKey) => void;
  isRoute: (route: RouteKey) => boolean;
  goBack: () => void;
  history: RouteKey[];
};

const RoutingContext = createContext<RoutingContextType | undefined>(undefined);

type RoutingProviderProps = PropsWithChildren<{
  initialRoute?: RouteKey;
}>;

export const RoutingProvider = ({
  initialRoute = "",
  children,
}: RoutingProviderProps) => {
  const [history, setHistory] = useState<RouteKey[]>([initialRoute]);
  const route = history[history.length - 1];

  const navigate = (newRoute: RouteKey) => {
    setHistory((prev) => [...prev, newRoute]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const isRoute = (check: RouteKey) => route === check;

  return (
    <RoutingContext value={{ route, navigate, isRoute, goBack, history }}>
      {children}
    </RoutingContext>
  );
};

export const useRouting = (): RoutingContextType => {
  const context = useContext(RoutingContext);
  if (!context) {
    throw new Error("useRouting must be used within a RoutingProvider");
  }
  return context;
};
