const GRID_SIZE = 13;

function isFinderCell(row: number, column: number): boolean {
  const isCornerBlock = (row < 4 || row >= GRID_SIZE - 4) && (column < 4 || column >= GRID_SIZE - 4);
  return isCornerBlock && !(row >= GRID_SIZE - 4 && column >= GRID_SIZE - 4);
}

function isFilled(row: number, column: number): boolean {
  if (isFinderCell(row, column)) return row % 3 !== 1 || column % 3 !== 1 || row === column;
  return (row * 7 + column * 13 + row * column) % 3 !== 0;
}

export function FakeQr() {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
    key: index,
    isOn: isFilled(Math.floor(index / GRID_SIZE), index % GRID_SIZE),
  }));
  return (
    <div
      aria-hidden
      className="grid size-28 rounded-lg bg-white p-2"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
    >
      {cells.map((cell) => (
        <span key={cell.key} className={cell.isOn ? "bg-wine" : "bg-white"} />
      ))}
    </div>
  );
}
