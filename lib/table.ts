import { Column } from "@tanstack/react-table";
import { CSSProperties } from "react";

export const getPinningLeftStyles = <T>(column: Column<T>): CSSProperties => {
  return {
    left: `${column.getStart("left")}px`,
    opacity: 0.95,
    position: "sticky",
    width: column.getSize(),
    zIndex: 1,
  };
};

export const getPinningRightStyles = <T>(column: Column<T>): CSSProperties => {
  return {
    right: `${column.getAfter("right")}px`,
    opacity: 0.95,
    position: "sticky",
    width: column.getSize(),
    zIndex: 1,
  };
};
