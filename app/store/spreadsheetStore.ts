import { create } from 'zustand';

// Simple cell data structure (no formula)
interface CellData {
  value: string;
}

// Simplified state interface
interface SpreadsheetState {
  cells: Record<string, CellData>;
  selectedCell: { row: number; col: number } | null;
  
  // Actions
  getCellValue: (row: number, col: number) => string;
  updateCell: (row: number, col: number, newValue: string) => void;
  selectCell: (row: number, col: number) => void;
}

// Helper to create cell key
const getCellKey = (row: number, col: number) => `${row}:${col}`;

// Create Zustand store with simplified logic
const useSpreadsheetStore = create<SpreadsheetState>((set, get) => ({
  // State
  cells: {},
  selectedCell: null,
  
  // Get cell value
  getCellValue: (row, col) => {
    const key = getCellKey(row, col);
    return get().cells[key]?.value || "";
  },
  
  // Select a cell
  selectCell: (row, col) => {
    set({ selectedCell: { row, col } });
  },
  
  // Update cell value - no formula processing
  updateCell: (row, col, newValue) => {
    const key = getCellKey(row, col);
    
    // Simple update without formula handling
    set(state => ({
      cells: {
        ...state.cells,
        [key]: { value: newValue }
      }
    }));
  }
}));

export default useSpreadsheetStore; 