export type RitzFloorTableShape =
  | "round"
  | "rectangle"
  | "booth"
  | "counter";

export type RitzFloorTableSpec = {
  label: string;
  capacity: number;
  floorX: number;
  floorY: number;
  shape: RitzFloorTableShape;
};

export type RitzFloorSectionSpec = {
  name: string;
  displayOrder: number;
  floor: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  tables: readonly RitzFloorTableSpec[];
};

/**
 * Canonical service floor traced from the Ritz Diner plan supplied for Lazy Jane's.
 *
 * floor.x/y/width/height place each service area on the whole-building POS plan.
 * Table floorX/floorY are positions inside that area.
 *
 * Demo presets restore these records exactly; they do not infer a new layout.
 */
export const RITZ_FLOOR_SECTIONS: readonly RitzFloorSectionSpec[] = [
  {
    name: "Main Dining Room",
    displayOrder: 10,
    floor: { x: 2, y: 4, width: 47, height: 88 },
    tables: [
      { label: "1", capacity: 4, floorX: 14, floorY: 11, shape: "round" },
      { label: "2", capacity: 4, floorX: 49, floorY: 11, shape: "rectangle" },
      { label: "3", capacity: 4, floorX: 81, floorY: 11, shape: "rectangle" },
      { label: "4", capacity: 4, floorX: 10, floorY: 30, shape: "rectangle" },
      { label: "5", capacity: 4, floorX: 14, floorY: 43, shape: "round" },
      { label: "6", capacity: 4, floorX: 49, floorY: 34, shape: "round" },
      { label: "7", capacity: 4, floorX: 78, floorY: 34, shape: "round" },
      { label: "8", capacity: 4, floorX: 49, floorY: 51, shape: "round" },
      { label: "9", capacity: 6, floorX: 78, floorY: 51, shape: "rectangle" },
      { label: "10", capacity: 4, floorX: 10, floorY: 62, shape: "rectangle" },
      { label: "11", capacity: 4, floorX: 48, floorY: 69, shape: "round" },
      { label: "12", capacity: 4, floorX: 78, floorY: 69, shape: "round" },
      { label: "13", capacity: 4, floorX: 14, floorY: 88, shape: "round" },
      { label: "14", capacity: 4, floorX: 49, floorY: 88, shape: "rectangle" },
      { label: "15", capacity: 4, floorX: 80, floorY: 88, shape: "round" },
    ],
  },
  {
    name: "Center Booths",
    displayOrder: 20,
    floor: { x: 52, y: 35, width: 30, height: 25 },
    tables: [
      { label: "B1", capacity: 4, floorX: 18, floorY: 55, shape: "booth" },
      { label: "B2", capacity: 4, floorX: 50, floorY: 55, shape: "booth" },
      { label: "B3", capacity: 4, floorX: 82, floorY: 55, shape: "booth" },
    ],
  },
  {
    name: "Counter",
    displayOrder: 30,
    floor: { x: 52, y: 62, width: 30, height: 13 },
    tables: [
      { label: "C1", capacity: 1, floorX: 5, floorY: 52, shape: "counter" },
      { label: "C2", capacity: 1, floorX: 13, floorY: 52, shape: "counter" },
      { label: "C3", capacity: 1, floorX: 21, floorY: 52, shape: "counter" },
      { label: "C4", capacity: 1, floorX: 29, floorY: 52, shape: "counter" },
      { label: "C5", capacity: 1, floorX: 37, floorY: 52, shape: "counter" },
      { label: "C6", capacity: 1, floorX: 45, floorY: 52, shape: "counter" },
      { label: "C7", capacity: 1, floorX: 53, floorY: 52, shape: "counter" },
      { label: "C8", capacity: 1, floorX: 61, floorY: 52, shape: "counter" },
      { label: "C9", capacity: 1, floorX: 69, floorY: 52, shape: "counter" },
      { label: "C10", capacity: 1, floorX: 77, floorY: 52, shape: "counter" },
      { label: "C11", capacity: 1, floorX: 85, floorY: 52, shape: "counter" },
      { label: "C12", capacity: 1, floorX: 93, floorY: 52, shape: "counter" },
    ],
  },
  {
    name: "Window Booths",
    displayOrder: 40,
    floor: { x: 84, y: 35, width: 14, height: 43 },
    tables: [
      { label: "W1", capacity: 4, floorX: 50, floorY: 12, shape: "booth" },
      { label: "W2", capacity: 4, floorX: 50, floorY: 37, shape: "booth" },
      { label: "W3", capacity: 4, floorX: 50, floorY: 63, shape: "booth" },
      { label: "W4", capacity: 4, floorX: 50, floorY: 88, shape: "booth" },
    ],
  },
  {
    name: "Front Booths",
    displayOrder: 50,
    floor: { x: 52, y: 80, width: 46, height: 16 },
    tables: [
      { label: "F1", capacity: 4, floorX: 12, floorY: 52, shape: "booth" },
      { label: "F2", capacity: 4, floorX: 37, floorY: 52, shape: "booth" },
      { label: "F3", capacity: 4, floorX: 62, floorY: 52, shape: "booth" },
      { label: "F4", capacity: 4, floorX: 87, floorY: 52, shape: "booth" },
    ],
  },
];

export const RITZ_FLOOR_TABLE_COUNT = RITZ_FLOOR_SECTIONS.reduce(
  (total, section) => total + section.tables.length,
  0,
);
