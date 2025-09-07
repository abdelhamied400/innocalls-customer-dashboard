"use client";

import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useMemo,
} from "react";

type RouteKey = string;

type RoutingContextType = {
  route: RouteKey;
  navigate: (route: RouteKey) => void;
  isRoute: (route: RouteKey) => boolean;
  getParams: (pattern: string) => Record<string, string>;
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
  const route = useMemo(() => history[history.length - 1], [history]);

  const navigate = (newRoute: RouteKey) => {
    setHistory((prev) => [...prev, newRoute]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const isRoute = (check: RouteKey) => {
    if (route === check) return true;
    const pattern = "^" + check.replace(/:[^/]+/g, "[^/]+") + "$";
    const regex = new RegExp(pattern);
    return regex.test(route);
  };

  const getParams = (pattern: string): Record<string, string> => {
    // pattern can be like "/contacts/update/:id"
    const regexPattern = pattern.replace(/:[^/]+/g, "([^/]+)");
    const regex = new RegExp(`^${regexPattern}$`);
    const match = route.match(regex);
    if (!match) return {};
    const keys = pattern.match(/:([^/]+)/g) || [];
    const params: Record<string, string> = {};
    keys.forEach((key, index) => {
      const paramName = key.slice(1); // Remove the leading ':'
      params[paramName] = match[index + 1]; // match[0] is the full match
    });
    return params;
  };

  return (
    <RoutingContext
      value={{ route, navigate, isRoute, getParams, goBack, history }}
    >
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
