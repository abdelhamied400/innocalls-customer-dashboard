"use client";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type AutoDialerFilterContextType = {
  filters: {
    creationDate: { from: Date | null; to: Date | null };
    durationType: string | null;
    status: string | null;
  };
  updateFilter: (key: string, value: any) => void;
};
const AutoDialerFilterContext = createContext<AutoDialerFilterContextType>({
  filters: {
    creationDate: { from: null, to: null },
    durationType: null,
    status: null,
  },
  updateFilter: () => {},
});

type FilterProviderProps = PropsWithChildren<object>;
const AutoDialerFilterProvider = ({ children }: FilterProviderProps) => {
  const [filters, setFilters] = useState({
    creationDate: { from: null, to: null },
    durationType: null,
    status: null,
  });

  const updateFilter = (key: string, value: any) => {
    // setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AutoDialerFilterContext value={{ filters, updateFilter }}>
      {children}
    </AutoDialerFilterContext>
  );
};

export const useFilters = () => useContext(AutoDialerFilterContext);

export default AutoDialerFilterProvider;
