"use client";

import React, { useState, useEffect } from "react";
import useSpreadsheetStore from "../store/spreadsheetStore";

export default function FormulaBar() {
  // Get selected cell and its value from the store
  const selectedCell = useSpreadsheetStore((state) => state.selectedCell);
  const getCellValue = useSpreadsheetStore((state) => state.getCellValue);
  const updateCell = useSpreadsheetStore((state) => state.updateCell);

  // Local state for the input value
  const [inputValue, setInputValue] = useState<string>("");

  // Update input value when selected cell changes
  useEffect(() => {
    if (selectedCell) {
      const value = getCellValue(selectedCell.row, selectedCell.col);
      setInputValue(value);
    } else {
      setInputValue("");
    }
  }, [selectedCell, getCellValue]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  // Handle input blur
  const handleBlur = () => {
    if (selectedCell) {
      updateCell(selectedCell.row, selectedCell.col, inputValue);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedCell) {
      updateCell(selectedCell.row, selectedCell.col, inputValue);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50 h-full">
      <span className="text-sm text-gray-600">
        {selectedCell ? `${selectedCell.row + 1}:${selectedCell.col + 1}` : ""}
      </span>
      <input
        type="text"
        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Enter value or formula"
      />
    </div>
  );
}
