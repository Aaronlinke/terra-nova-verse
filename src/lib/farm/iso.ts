// Isometric grid math.
// World space: gridX, gridY (integers)
// Screen space: px relative to a chosen origin

export const TILE_W = 96; // diamond width
export const TILE_H = 56; // diamond height
export const GRID_COLS = 4;
export const GRID_ROWS = 3;

export function isoToScreen(gx: number, gy: number) {
  const x = (gx - gy) * (TILE_W / 2);
  const y = (gx + gy) * (TILE_H / 2);
  return { x, y };
}

export function plotIndexToGrid(idx: number) {
  return { gx: idx % GRID_COLS, gy: Math.floor(idx / GRID_COLS) };
}

// Z-Index for correct overlap (back→front)
export function isoZ(gx: number, gy: number) {
  return (gx + gy) * 10 + 100;
}

// Bounding box of full grid in screen space
export function gridBounds() {
  const maxX = (GRID_COLS - 1) * (TILE_W / 2) + TILE_W / 2;
  const minX = -((GRID_ROWS - 1) * (TILE_W / 2)) - TILE_W / 2;
  const minY = -TILE_H / 2;
  const maxY = (GRID_COLS - 1 + GRID_ROWS - 1) * (TILE_H / 2) + TILE_H / 2;
  return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
}
