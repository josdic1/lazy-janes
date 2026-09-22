LAZY JANE'S SAFE MENU SAVE CHECKS

Adds one new backend check file:

  backend/test/menuCustomizationSave.test.ts

It proves:

1. An unrelated customization edit preserves stable choice group/option IDs,
   preparation targets, choice constraints, menu rules, item additions, and
   replacement metadata.
2. A choice group/option is deleted only when it is intentionally omitted.
3. If final food-structure validation fails, all earlier writes and deletions
   in the transaction roll back.

The check creates isolated UUID-named test data and removes it afterward.
It never resets, seeds, or replaces the database.

Run from the Lazy Jane's project root:

  npm run build --workspace @lazy-janes/shared && \
  env -u DATABASE_URL -u PIN_PEPPER NODE_ENV=test \
  npx vitest run backend/test/menuCustomizationSave.test.ts \
    --config backend/vitest.config.ts && \
  npm test --workspace @lazy-janes/backend && \
  git diff --check

