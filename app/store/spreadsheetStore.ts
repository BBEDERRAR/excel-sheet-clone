import { create } from "zustand";
import { evaluate } from 'mathjs';

interface CellData {
  value: string;
  formula?: string;
}

interface SpreadsheetState {
  cells: Record<string, CellData>;
  dependents: Record<string, string[]>;
  selectedCell: { row: number; col: number } | null;
  // Actions
  getCellValue: (row: number, col: number) => string;
  getCellRawValue: (row: number, col: number) => string;
  updateCell: (row: number, col: number, newValue: string) => void;
  selectCell: (row: number, col: number) => void;
  getDependenciesFromFormula: (formula: string) => string[];
  calculateFormulaValue: (formula: string) => number;
}

const getCellKey = (row: number, col: number) => `${row}:${col}`;

const useSpreadsheetStore = create<SpreadsheetState>((set, get) => ({
  // State
  cells: {},
  dependents: {},
  selectedCell: null,

  getCellValue: (row, col) => {
    const key = getCellKey(row, col);
    return get().cells[key]?.value || "";
  },

  getCellRawValue: (row, col) => {
    const key = getCellKey(row, col);
    const cell = get().cells[key];
    return cell?.formula || cell?.value || "";
  },

  selectCell: (row, col) => {
    set({ selectedCell: { row, col } });
  },

  getDependenciesFromFormula: (formula: string) => {
    const dependencies: string[] = [];

    // split the formula by + - * ( and ) /
    formula.split(/([+\-*()/])/).map((part) => {
      if (!part.match(/([+\-*\/])/)) {
        const isCell = part.includes(":");
        if (isCell) {
          const cell = part.split(":");
          const row = parseInt(cell[0]);
          const col = parseInt(cell[1]);

          const dependencyKey = getCellKey(row, col);
          dependencies.push(dependencyKey);
        }
      }
    });

    return dependencies;
  },

  calculateFormulaValue: (formula: string) => {
    // split the formula by + - * ( and ) /
    const formulaPartsArray = formula.split(/([+\-*()/])/).map((part) => {
      if (part.match(/([+\-*\/])/)) {
        return { formula: part, type: "operator" };
      } else {
        const isCell = part.includes(":");
        if (isCell) {
          const cell = part.split(":");
          const row = parseInt(cell[0]);
          const col = parseInt(cell[1]);

          return {
            formula: part,
            type: "cell",
            value: get().getCellValue(row, col) || 0,
          };
        } else {
          return { formula: part, type: "number", value: part };
        }
      }
    });

    const formulaValueString = formulaPartsArray
      .map((part) => {
        if (part.type === "cell") {
          return part.value;
        } else {
          return part.formula;
        }
      })
      .join("");

    return evaluate(formulaValueString);
  },

  updateCell: (row, col, newValue) => {
    const key = getCellKey(row, col);
    if (newValue?.startsWith("=")) {
      const formula = newValue.slice(1);
      const dependencies = get().getDependenciesFromFormula(formula);
      const formulaValue = get().calculateFormulaValue(formula);

      set((state) => ({
        cells: {
          ...state.cells,
          [key]: {
            value: formulaValue.toString(),
            formula: newValue,
          },
        },
      }));

      // Register this cell as a dependent of its dependencies
      dependencies.forEach((depKey) => {
        set((state) => ({
          dependents: {
            ...state.dependents,
            [depKey]: [...(state.dependents[depKey] || []), key],
          },
        }));
      });
    } else {
      set((state) => ({
        cells: {
          ...state.cells,
          [key]: { value: newValue, formula: newValue },
        },
      }));
    }

    // Recalculate any cells that depend on this one
    const dependentCells = get().dependents[key] || [];
    dependentCells.forEach((depKey) => {
      const [row, col] = depKey.split(":");
      get().updateCell(
        parseInt(row),
        parseInt(col),
        get().getCellRawValue(parseInt(row), parseInt(col))
      );
    });
  },
}));

export default useSpreadsheetStore;
