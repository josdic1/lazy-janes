# Lazy Jane's

Restaurant operations app with a normalized Universal Menu Ontology (UMO), live order entry, floor/service tracking, kitchen progression, checks/payments, register management, menu management, and role-based users.

## App surfaces

- **Operations** — live visual floor plan, waitlist/seating, parties/tables, service state, checks, payments, cash drawer, and manager links.
- **Order Entry** — dine-in/takeout/delivery ordering with UMO-driven remove/side/extra/substitution/choice/preparation behavior.
- **Kitchen** — streaming kitchen display board with fired/ready tickets and modifier detail.
- **Menu Management** — menu items, ingredient/component relationships, choices, preparation, availability, pricing, and safety declarations.
- **Users** — admin user/role/PIN management.

## Local development

Requires Node 24, npm 11, PostgreSQL, and a backend `.env` based on `backend/.env.example`.

```bash
npm install
npm run db:migrate --workspace @lazy-janes/backend
npm run db:seed:menu --workspace @lazy-janes/backend
```

Backend:

```bash
npm run dev --workspace @lazy-janes/backend
```

Frontend on the project-standard port:

```bash
npm run dev --workspace @lazy-janes/frontend -- --port 5176
```

Open `http://localhost:5176`.

## Verification

```bash
npm run build
npm test --workspace @lazy-janes/backend
```

The repository deliberately preserves unknown menu pricing/capability truth instead of silently treating unknown values as free or inventing substitutions.

## Kitchen board

Kitchen staff have a dedicated `/kitchen` live board. Fired items stream into the Cooking lane, complete kitchen modifications and notes are shown on each ticket, and chefs can mark the active ticket items ready. Ready tickets remain visible for service staff to run and deliver from Operations. The board refreshes automatically every two seconds.

## Dining-room floor plan

Managers create tables in Floor Setup. Every active table appears immediately on the Operations floor plan and its saved position can be arranged by drag-and-drop. Hosts and service staff seat waiting parties directly from the visual floor, including selecting multiple tables for a combined seating. Occupied tables are visibly unavailable.
