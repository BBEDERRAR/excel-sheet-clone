# Excel Sheet Clone

## Challenge Overview

Create a 10000x10000 excel sheet clone, which will allow a user to edit any cell. The excel sheet should
support basic mathematical operations between columns (like A1+B1=C1).

## Technical Challenge

Creating a spreadsheet with 100 million potential cells presents several technical challenges:

1. **Memory & Performance Constraints**: Rendering all cells simultaneously would crash most browsers
2. **Real-time Calculation**: Supporting formulas requires efficient state updates and dependency tracking
3. **Responsive UI**: Maintaining smooth scrolling and editing across an enormous data grid

## Implementation Approach

### 1. Virtualized Rendering

To handle the 10,000×10,000 grid efficiently:

- Implemented **windowing/virtualization** using `@tanstack/react-virtual`
- Only renders cells currently visible in the viewport (typically 50-100 cells at once)
- Dynamically creates and recycles DOM nodes as the user scrolls
- Maintains the illusion of a complete grid while using minimal resources

```jsx
// Example of virtualization implementation
const rowVirtualizer = useVirtualizer({
  count: 10000,
  getScrollElement: () => containerRef.current,
  estimateSize: () => 35,
  overscan: 5,
});
```

### 2. State Management with Zustand

Chose Zustand over React's useState for several key advantages:

- **Performance**: Minimizes re-renders with selective updates
- **Predictable State**: Single source of truth for the entire grid
- **Simpler API**: Less boilerplate than Redux while maintaining powerful capabilities
- **Persistence**: Easier to implement save/load functionality

### 3. Formula Calculation Engine

Implemented a mathematical expression parser that:

- Supports basic arithmetic operations (`+`, `-`, `*`, `/`)
- Uses cell references in the format `row:column` (e.g., `=A1+B1` is `=0:0+0:1`)
- Builds a dependency graph to efficiently update dependent cells
- Prevents circular reference errors

### 4. Optimized Update Algorithm

To ensure fast recalculation when cells change:

- Tracks cell dependencies in a directed graph
- Only recalculates affected cells when dependencies change

### 5. Security risks: using eval can lead to Cross-Site Scripting (XSS)

- Moved from eval to math.js Library to calculate math operations

## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Formula Syntax Guide

The spreadsheet supports basic mathematical operations:

- Formulas begin with `=` (e.g., `=1+2`)
- Cell references use `row:column` format (e.g., `=0:0+1:0`)
- Supported operators: `+`, `-`, `*`, `/`
- Example: `=0:0*2+5:3` multiplies cell (0,0) by 2, then adds the value from cell (5,3)

## Technical Highlights

- **React/Next.js**: Modern frontend framework for performance and developer experience
- **Virtualization**: Only renders visible cells, enabling the 10,000×10,000 grid
- **State Management**: Zustand for efficient global state handling
- **Formula Engine**: Custom parser and evaluator for spreadsheet calculations
- **Dependency Tracking**: Smart recalculation of only affected cells

## Future Enhancements

- Support for more complex formulas and functions
- Collaborative editing capabilities
- Import/export compatibility with Excel/CSV formats
- Cell styling and formatting options
