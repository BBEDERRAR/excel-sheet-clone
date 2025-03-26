"use client";

import React, { useState, useEffect } from "react";

// Define the Cell interface for the component props
export interface CellProps {
  value: string;
  row: number;
  col: number;
  isSelected: boolean;
  bgColor?: string;
  onSelect: (row: number, col: number) => void;
  onChange: (value: string) => void;
}

// Define the Cell component
export default function Cell({
  value,
  row,
  col,
  isSelected,
  bgColor,
  onSelect,
  onChange,
}: CellProps) {
  // State for editing the cell value
  const [editValue, setEditValue] = useState<string>(value);

  // Update editValue when value prop changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // Handle cell click
  const handleClick = () => {
    onSelect(row, col);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    onChange(newValue);
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
