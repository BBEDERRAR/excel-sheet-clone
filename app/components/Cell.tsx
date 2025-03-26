"use client";

import React, { useState, useEffect } from "react";
import useSpreadsheetStore from "@store/spreadsheetStore";

export interface CellProps {
  row: number;
  col: number;
  bgColor?: string;
}

export default function Cell({ row, col, bgColor }: CellProps) {
  const value = useSpreadsheetStore((state) => state.getCellValue(row, col));
  const formula = useSpreadsheetStore((state) =>
    state.getCellRawValue(row, col)
  );

  const isSelected = useSpreadsheetStore(
    (state) =>
      state.selectedCell?.row === row && state.selectedCell?.col === col
  );
  const updateCell = useSpreadsheetStore((state) => state.updateCell);
  const selectCell = useSpreadsheetStore((state) => state.selectCell);

  const [editValue, setEditValue] = useState<string>(value);

  useEffect(() => {
    if (isSelected) {
      if (formula) {
        setEditValue(formula);
      } else {
        setEditValue(value);
      }
    } else {
      setEditValue(value);
    }
  }, [value, isSelected]);

  const handleClick = () => {
    selectCell(row, col);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
  };

  const handleBlur = () => {
    updateCell(row, col, editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateCell(row, col, editValue);
      selectCell(row, col + 1);
    }
  };

  return (
    <div
      className={`w-full h-full border-b border-r border-gray-300 flex-shrink-0 ${
        isSelected
          ? "bg-blue-100 outline-2 outline-blue-500"
          : bgColor || "bg-white"
      }`}
      onClick={handleClick}
    >
      {isSelected ? (
        <input
          className="w-full h-full px-1 outline-none bg-transparent"
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div className="px-1 w-full h-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
          {value}
        </div>
      )}
    </div>
  );
}
