"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { ColumnSizing } from "~/hooks/useColumnSizing";

type ColumnSizingContextType = {
  columnSizing: ColumnSizing;
  handleColumnResizing: (colSizes: ColumnSizing) => void;
};

const ColumnSizingContext = createContext<ColumnSizingContextType | undefined>(
  undefined,
);

export function ColumnSizingProvider({
  children,
  columnSizing,
  handleColumnResizing,
}: PropsWithChildren<{
  columnSizing: ColumnSizing;
  handleColumnResizing: (colSizes: ColumnSizing) => void;
}>) {
  return (
    <ColumnSizingContext.Provider
      value={{ columnSizing, handleColumnResizing }}
    >
      {children}
    </ColumnSizingContext.Provider>
  );
}

export function useColumnSizingContext() {
  const context = useContext(ColumnSizingContext);
  if (!context) {
    throw new Error(
      "useColumnSizingContext must be used within a ColumnSizingProvider",
    );
  }
  return context;
}
