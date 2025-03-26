"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useState } from "react";
import Cell from "./Cell";

interface CellData {
  value: string;
}

const HEADER_HEIGHT = 30;
const ROW_HEADER_WIDTH = 50;

export default function Spreadsheet() {
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const [data, setData] = useState<Record<string, CellData>>({});

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const getCellValue = (row: number, col: number) => {
    return data[`${row},${col}`]?.value || "";
  };

  const updateCell = (row: number, col: number, newValue: string) => {
    setData((prev) => ({
      ...prev,
      [`${row},${col}`]: { value: newValue },
    }));
  };

  return (
    <>
      <div ref={parentRef} className="w-full h-screen overflow-auto relative">
        {/* Fixed corner cell (top-left) */}
        <div
          className="absolute top-0 left-0 z-20 bg-gray-200 border-r border-b flex items-center justify-center text-sm text-gray-600"
          style={{
            height: `${HEADER_HEIGHT}px`,
            width: `${ROW_HEADER_WIDTH}px`,
          }}
        >
          R:C
        </div>

        {/* Column headers */}
        <div
          className="absolute top-0 left-0 z-10"
          style={{
            height: `${HEADER_HEIGHT}px`,
            transform: `translateX(${ROW_HEADER_WIDTH}px)`,
            width: `${columnVirtualizer.getTotalSize()}px`,
          }}
        >
          {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
            <div
              key={`header-${virtualColumn.key}`}
              className="absolute top-0 h-full flex items-center justify-center bg-gray-100 border-r border-b font-medium"
              style={{
                left: `${virtualColumn.start}px`,
                width: `${virtualColumn.size}px`,
              }}
            >
              {virtualColumn.index + 1}
            </div>
          ))}
        </div>

        {/* Row headers */}
        <div
          className="absolute top-0 left-0 z-10"
          style={{
            width: `${ROW_HEADER_WIDTH}px`,
            transform: `translateY(${HEADER_HEIGHT}px)`,
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={`row-header-${virtualRow.key}`}
              className="absolute left-0 w-full flex items-center justify-center bg-gray-100 border-r border-b font-medium"
              style={{
                top: `${virtualRow.start}px`,
                height: `${virtualRow.size}px`,
              }}
            >
              {virtualRow.index + 1}
            </div>
          ))}
        </div>

        {/* Spreadsheet cells with offset for headers */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: "relative",
            transform: `translateX(${ROW_HEADER_WIDTH}px) translateY(${HEADER_HEIGHT}px)`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <React.Fragment key={virtualRow.key}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                <div
                  key={virtualColumn.key}
                  className="absolute top-0 left-0"
                  style={{
                    height: `${virtualRow.size}px`,
                    width: `${virtualColumn.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Cell
                    value={getCellValue(virtualRow.index, virtualColumn.index)}
                    row={virtualRow.index}
                    col={virtualColumn.index}
                    isSelected={
                      selectedCell?.row === virtualRow.index &&
                      selectedCell?.col === virtualColumn.index
                    }
                    onSelect={handleCellClick}
                    onChange={(value) =>
                      updateCell(virtualRow.index, virtualColumn.index, value)
                    }
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
