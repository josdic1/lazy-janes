import { describe, expect, it } from "vitest";
import {
  RITZ_FLOOR_SECTIONS,
  RITZ_FLOOR_TABLE_COUNT,
} from "../src/ritzFloor.js";

describe("Ritz canonical floor", () => {
  it("keeps one deterministic service layout", () => {
    expect(RITZ_FLOOR_SECTIONS.map((section) => section.name)).toEqual([
      "Main Dining Room",
      "Center Booths",
      "Counter",
      "Window Booths",
      "Front Booths",
    ]);
    expect(RITZ_FLOOR_TABLE_COUNT).toBe(38);

    const keys = RITZ_FLOOR_SECTIONS.flatMap((section) =>
      section.tables.map((table) => `${section.name}:${table.label}`),
    );
    expect(new Set(keys).size).toBe(keys.length);

    for (const section of RITZ_FLOOR_SECTIONS) {
      expect(section.floor.x).toBeGreaterThanOrEqual(0);
      expect(section.floor.y).toBeGreaterThanOrEqual(0);
      expect(section.floor.x + section.floor.width).toBeLessThanOrEqual(100);
      expect(section.floor.y + section.floor.height).toBeLessThanOrEqual(100);

      for (const table of section.tables) {
        expect(table.floorX).toBeGreaterThanOrEqual(0);
        expect(table.floorX).toBeLessThanOrEqual(100);
        expect(table.floorY).toBeGreaterThanOrEqual(0);
        expect(table.floorY).toBeLessThanOrEqual(100);
        expect(table.capacity).toBeGreaterThan(0);
      }
    }
  });
});
