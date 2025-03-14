"use client";

import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  TableOptions,
  Table as TableType,
  flexRender,
  Updater,
  ColumnResizeMode,
  ColumnResizeDirection,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import React, { RefObject, useState } from "react";
import { PropsWithChildren } from "react";
import useColumnSizing, { ColumnSizing } from "~/hooks/useColumnSizing";
import { PaginationType } from "~/types/api";
import { ColumnSizingProvider } from "./context";

const PAGE_SIZE = 25;
const DEFAULT_PAGINATION_STATE = { pageIndex: 0, pageSize: PAGE_SIZE };
const DEFAULT_SORTING_STATE = [{ id: "breed", desc: false }];

function TableRow({
  children,
  className,
  even,
  width,
}: PropsWithChildren<{
  className?: string;
  even?: boolean;
  width?: number;
}>) {
  return (
    <tr
      style={{ width: width ? `${width}px` : undefined }}
      className={even ? className : `bg-gray-50 ${className}`}
    >
      {children}
    </tr>
  );
}

function TableCell({
  children,
  as,
  width,
}: PropsWithChildren<{
  as: "th" | "td";
  width: number;
}>) {
  return as === "th" ? (
    <th
      className="pl-4 text-start text-blue-900"
      style={{
        width: `${width}px`,
      }}
    >
      {children}
    </th>
  ) : (
    <td
      className="text-start"
      style={{
        width: `${width}px`,
      }}
    >
      {children}
    </td>
  );
}

function TableHead<TD>({
  columnSizing,
  table,
  width,
}: {
  columnSizing: ColumnSizing;
  table: TableType<TD>;
  width: number | undefined;
}) {
  return (
    <thead className="font-roboto inset-2 border-b-2 border-blue-900">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="h-12" width={width}>
          {headerGroup.headers.map((header) => (
            <TableCell
              as={"th"}
              key={header.id}
              width={columnSizing[header.id]}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </thead>
  );
}

function TableBody<TD>({
  columnSizing,
  table,
  width,
}: {
  columnSizing: ColumnSizing;
  table: TableType<TD>;
  width: number | undefined;
}) {
  return (
    <tbody className="font-roboto-condensed">
      {table.getRowModel().rows.map((row, i) => (
        <TableRow
          key={row.id}
          className="h-24"
          width={width}
          even={i % 2 === 0}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              as={"td"}
              width={columnSizing[cell.column.id]}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </tbody>
  );
}

export default function Table<TD>({
  columns,
  data,
  loading,
  pagination,
  sortingState,
  width,
  widthRef,
  setContainerWidth,
}: {
  columns: Array<ColumnDef<TD>>;
  data: Array<TD>;
  loading?: boolean;
  pagination?: PaginationType;
  sortingState?: SortingState;
  width?: number;
  widthRef: RefObject<HTMLDivElement | null>;
  setContainerWidth: (width: number) => void;
}) {
  const handleColumnSizingChange = (updaterOrValue: Updater<ColumnSizing>) => {
    if (typeof updaterOrValue === "function") {
      handleColumnResizing(updaterOrValue(columnSizing));
    } else {
      handleColumnResizing(updaterOrValue);
    }
  };

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnResizeDirection] = useState<ColumnResizeDirection>("ltr");
  // const [columnSorting, setColumnSorting] = useState<SortingState>([]);
  const [paginationState, setPaginationState] = useState<PaginationState>(
    DEFAULT_PAGINATION_STATE,
  );

  const tableOptions: TableOptions<TD> = {
    columns,
    columnResizeMode,
    columnResizeDirection,
    data,
    autoResetPageIndex: true,
    enableColumnResizing: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: pagination?.total,
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: handleColumnSizingChange,
    onPaginationChange: setPaginationState,
    // onSortingChange: setColumnSorting,
    initialState: {
      columnSizing: {},
      pagination: DEFAULT_PAGINATION_STATE,
      sorting: sortingState ?? DEFAULT_SORTING_STATE,
    },
    state: { pagination: paginationState, sorting: sortingState },
    debugTable: process.env.NODE_ENV === "development",
  };
  const table = useReactTable(tableOptions);

  const { columnSizing, handleColumnResizing } = useColumnSizing<TD>(
    columns,
    width,
    setContainerWidth,
    widthRef,
    table,
  );

  return (
    <ColumnSizingProvider
      columnSizing={columnSizing}
      handleColumnResizing={handleColumnResizing}
    >
      <table
        className={`w-0 transition-all duration-300 ease-in-out ${
          loading
            ? "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            : ""
        }`}
      >
        <TableHead<TD>
          columnSizing={columnSizing}
          table={table}
          width={width}
        />
        <TableBody<TD>
          columnSizing={columnSizing}
          table={table}
          width={width}
        />
      </table>
    </ColumnSizingProvider>
  );
}

export const MemoizedTable = React.memo(Table, (prevProps, nextProps) => {
  return (
    prevProps.columns === nextProps.columns &&
    prevProps.data === nextProps.data &&
    prevProps.width === nextProps.width
  );
});
