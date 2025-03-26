import { create } from 'zustand';

// Simple cell data structure (no formula)
interface CellData {
  value: string;
  formula?: string;
}

// Simplified state interface
interface SpreadsheetState {
  cells: Record<string, CellData>;
  selectedCell: { row: number; col: number } | null;
  // Actions
  getCellValue: (row: number, col: number) => string;
  getCellRawValue: (row: number, col: number) => string;
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

  getCellRawValue: (row, col) => {
    const key = getCellKey(row, col);
    const cell = get().cells[key];
    return cell?.formula || cell?.value || "";
  },
  
  // Select a cell
  selectCell: (row, col) => {
    set({ selectedCell: { row, col } });
  },
  
  // Update cell value - no formula processing
  updateCell: (row, col, newValue) => {
    const key = getCellKey(row, col);
    if (newValue?.startsWith("=")) {
      // Handle formula
      const formula = newValue.slice(1);
      // split the formula by + - * ( and ) /
      const formulaParts = formula.split(/([+\-*()/])/);
      // add them to array of objects {formula: string, type: operator | cell | number, key}
      const formulaPartsArray = formulaParts.map(part => {
        if (!part.match(/([+\-*\/])/)) {
          const isCell = part.includes(":");
          if(isCell){
            const cell = part.split(":");
            const row = parseInt(cell[0]);
            const col = parseInt(cell[1]);
            return { formula: part, type: "cell", key, value: get().getCellValue(row, col) || 0 };
          }else{
            return { formula: part, type: "number", value: part };
          }
        } else {
          return { formula: part, type: "operator" };
        }
      });

      const formulaValueString = formulaPartsArray.map(part => {
        if (part.type === "cell") {
          return part.value;
        } else {
          return part.formula;
        }
      }).join("");

      const formulaValue = eval(formulaValueString);
      set(state => ({
        cells: {
          ...state.cells,
          [key]: { value: formulaValue, formula: newValue }
        }
      }));
    }else{
      set(state => ({
        cells: {
          ...state.cells,
          [key]: { value: newValue, formula: newValue }
        }
      }));
    }
    
  
  }
}));

export default useSpreadsheetStore; 