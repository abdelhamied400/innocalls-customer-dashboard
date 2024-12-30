import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

export type Cell<T> = CellContext<T, ReactNode>;
