import {
  getAllMenuItems,
  getCustomizationCatalog,
} from "../routes/menu.js";

import {
  assessLazyJanesCoverage,
} from "./lazyJanesCoverage.js";

import {
  normalizeLazyJanesOffering,
} from "./lazyJanesAdapter.js";

const items = await getAllMenuItems();
const catalog = await getCustomizationCatalog();

const results = items.map((item) => {
  const assessment = assessLazyJanesCoverage(item, catalog);

  if (assessment.status === "unsupported") {
    return assessment;
  }

  try {
    normalizeLazyJanesOffering({ item, catalog });
    return assessment;
  } catch (error) {
    return {
      itemId: item.id,
      itemName: item.name,
      status: "unsupported" as const,
      reasons: [
        `normalization_error:${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    };
  }
});

const counts = {
  total: results.length,
  clean: results.filter((r) => r.status === "clean").length,
  withUnknowns: results.filter(
    (r) => r.status === "with_unknowns",
  ).length,
  unsupported: results.filter(
    (r) => r.status === "unsupported",
  ).length,
};

const reasonCounts = new Map<string, number>();

for (const result of results) {
  for (const reason of result.reasons) {
    reasonCounts.set(
      reason,
      (reasonCounts.get(reason) ?? 0) + 1,
    );
  }
}

console.log("\nLAZY JANE'S UMO COVERAGE");
console.log("========================");
console.log(`Total:         ${counts.total}`);
console.log(`Clean:         ${counts.clean}`);
console.log(`With unknowns: ${counts.withUnknowns}`);
console.log(`Unsupported:   ${counts.unsupported}`);

console.log("\nREASONS");
console.log("=======");

for (const [reason, count] of [...reasonCounts.entries()].sort(
  (a, b) => b[1] - a[1],
)) {
  console.log(`${String(count).padStart(4)}  ${reason}`);
}

console.log("\nUNSUPPORTED ITEMS");
console.log("=================");

for (const result of results.filter(
  (r) => r.status === "unsupported",
)) {
  console.log(
    `${result.itemName} :: ${result.reasons.join(", ")}`,
  );
}
