import { RITZ_FLOOR_SECTIONS } from "@lazy-janes/shared";
import type { PoolClient } from "pg";

export async function restoreRitzFloor(client: PoolClient): Promise<void> {
  await client.query(`
    TRUNCATE TABLE dining_tables, sections
    RESTART IDENTITY CASCADE
  `);

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
    }
  }
}
