import { RITZ_FLOOR_SECTIONS } from "@lazy-janes/shared";
import type { PoolClient } from "pg";

export type RitzFloorLoadResult = {
  loaded: boolean;
  sections: number;
  tables: number;
};

async function insertRitzFloor(client: PoolClient): Promise<RitzFloorLoadResult> {
  let tableCount = 0;

  for (const section of RITZ_FLOOR_SECTIONS) {
    const inserted = await client.query<{ id: string }>(
      `
        INSERT INTO sections (name, display_order, is_active)
        VALUES ($1, $2, true)
        RETURNING id
      `,
      [section.name, section.displayOrder],
    );
    const sectionId = inserted.rows[0]?.id;
    if (!sectionId) {
      throw new Error(`Unable to restore Ritz floor area ${section.name}`);
    }

    for (const table of section.tables) {
      await client.query(
        `
          INSERT INTO dining_tables (
            section_id,
            label,
            capacity,
            floor_x,
            floor_y,
            is_active
          )
          VALUES ($1, $2, $3, $4, $5, true)
        `,
        [sectionId, table.label, table.capacity, table.floorX, table.floorY],
      );
      tableCount += 1;
    }
  }

  return {
    loaded: true,
    sections: RITZ_FLOOR_SECTIONS.length,
    tables: tableCount,
  };
}

export async function preloadRitzFloor(
  client: PoolClient,
): Promise<RitzFloorLoadResult> {
  const current = await client.query<{ sections: number; tables: number }>(`
    SELECT
      (SELECT count(*)::int FROM sections) AS sections,
      (SELECT count(*)::int FROM dining_tables) AS tables
  `);
  const row = current.rows[0]!;

  if (row.sections > 0 || row.tables > 0) {
    return {
      loaded: false,
      sections: row.sections,
      tables: row.tables,
    };
  }

  return insertRitzFloor(client);
}

export async function restoreRitzFloor(client: PoolClient): Promise<void> {
  await client.query(`
    TRUNCATE TABLE dining_tables, sections
    RESTART IDENTITY CASCADE
  `);

  await insertRitzFloor(client);
}
