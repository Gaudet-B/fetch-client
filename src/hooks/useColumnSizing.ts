import { RefObject, useEffect, useState } from "react";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";
import debounce from "lodash.debounce";

const EXTRA_PADDING = 20;
const LAST_COLUMN_PADDING = 4;

export type ColumnSizing = Record<string, number>;

function _getColumnSizes<TD>(
  cols: Array<ColumnDef<TD>>,
  width: number | undefined,
): ColumnSizing {
  if (!width) return {} as ColumnSizing;

  const columnSizing: ColumnSizing = {};
  let fixedWidth = 0,
    adjustableWidth = 0;

  // calculate fixed and adjustable column widths
  cols.forEach((col) => {
    const id = col.id as string;
    const { size } = col;
    columnSizing[id] = size ?? 0;
    if (size) {
      if (col.maxSize && col.maxSize > 0) {
        fixedWidth += size;
      } else {
        adjustableWidth += size;
      }
    }
  });

  // determine the "leftover" width and split proportionally between adjustable columns
  const totalWidth = adjustableWidth + fixedWidth;
  const leftoverWidth = width - totalWidth - EXTRA_PADDING;

  if (leftoverWidth > 0) {
    const adjustableColumns = cols.filter(
      (col) => !col.maxSize || col.maxSize <= 0,
    );
    adjustableColumns.forEach((col) => {
      const id = col.id as string;
      const size = col.size as number;
      const ratio = size / adjustableWidth;
      columnSizing[id] = size + leftoverWidth * ratio;
    });
  }

  const lastCol = cols[cols.length - 1];
  const lastColSize = columnSizing[lastCol.id as string];
  columnSizing[lastCol.id as string] = lastColSize - LAST_COLUMN_PADDING;

  return columnSizing;
}

export default function useColumnSizing<TD>(
  columns: Array<ColumnDef<TD>>,
  containerWidth: number | undefined,
  setContainerWidth: (width: number) => void,
  resultsRef: RefObject<HTMLDivElement | null>,
  table: TableType<TD>,
) {
  const [columnSizing, setColumnSizing] = useState<ColumnSizing>(
    _getColumnSizes(columns, containerWidth),
  );

  const handleColumnResizing = (colSizes: ColumnSizing) => {
    setColumnSizing(colSizes);
  };

  const handleResize = debounce(() => {
    const newWidth = resultsRef.current?.clientWidth ?? 0;
    setContainerWidth(newWidth);
    const newSizing = _getColumnSizes(columns, newWidth);
    setColumnSizing(newSizing);
    table.setColumnSizing(newSizing);
  }, 300);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    table.setColumnSizing(columnSizing);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { columnSizing, handleColumnResizing };
}
