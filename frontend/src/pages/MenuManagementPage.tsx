import {
  ArrowCounterClockwise,
  CaretDown,
  CaretRight,
  CheckCircle,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Power,
  SpinnerGap,
  Warning,
  X,
} from "@phosphor-icons/react";
import type {
  CreateMenuItemInput,
  MenuItem,
  MenuItemStatus,
} from "@lazy-janes/shared";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createMenuItem,
  deactivateMenuItem,
  getMenuItems,
  updateMenuItem,
} from "../api/menu.js";

const emptyForm: CreateMenuItemInput = {
  parentItemId: null,
  name: "",
  description: null,
  category: "",
  price: 0,
  status: "available",
  isSpecial: false,
  isModifier: false,
  dietaryFlags: [],
  sortOrder: 0,
};

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong.";
}

function statusLabel(status: MenuItemStatus): string {
  if (status === "eighty_sixed") {
    return "86’d";
  }

  return status[0]?.toUpperCase() + status.slice(1);
}

function StatusBadge({ status }: { status: MenuItemStatus }) {
  return (
    <span className="status-badge" data-status={status}>
      {statusLabel(status)}
    </span>
  );
}

type ItemActionsProps = {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onStatusToggle: (item: MenuItem) => void;
  onDeactivate: (item: MenuItem) => void;
};

function ItemActions({
  item,
  onEdit,
  onStatusToggle,
  onDeactivate,
}: ItemActionsProps) {
  const isAvailable = item.status === "available";

  return (
    <div className="item-actions">
      <button
        aria-label={`Edit ${item.name}`}
        className="icon-button"
        onClick={() => onEdit(item)}
        title="Edit"
        type="button"
      >
        <PencilSimple aria-hidden="true" />
      </button>

      <button
        aria-label={
          isAvailable
            ? `86 ${item.name}`
            : `Make ${item.name} available`
        }
        className="icon-button"
        onClick={() => onStatusToggle(item)}
        title={isAvailable ? "86 item" : "Make available"}
        type="button"
      >
        {isAvailable ? (
          <Warning aria-hidden="true" />
        ) : (
          <CheckCircle aria-hidden="true" />
        )}
      </button>

      {item.status !== "inactive" && (
        <button
          aria-label={`Deactivate ${item.name}`}
          className="icon-button" data-variant="danger"
          onClick={() => onDeactivate(item)}
          title="Deactivate"
          type="button"
        >
          <Power aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    MenuItemStatus | "all"
  >("all");
  const [collapsedCategories, setCollapsedCategories] = useState(
    new Set<string>(),
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);
  const [form, setForm] =
    useState<CreateMenuItemInput>(emptyForm);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    getMenuItems()
      .then((menuItems) => {
        if (active) {
          setItems(menuItems);
          setLoadError("");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(errorMessage(error));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () =>
      Array.from(new Set(items.map((item) => item.category))),
    [items],
  );

  const parentItems = useMemo(
    () => items.filter((item) => !item.isModifier),
    [items],
  );

  const modifiersByParent = useMemo(() => {
    const grouped = new Map<string, MenuItem[]>();

    for (const item of items) {
      if (!item.isModifier || item.parentItemId === null) {
        continue;
      }

      const current = grouped.get(item.parentItemId) ?? [];
      current.push(item);
      grouped.set(item.parentItemId, current);
    }

    return grouped;
  }, [items]);

  const groupedItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const grouped = new Map<string, MenuItem[]>();

    for (const item of parentItems) {
      if (
        categoryFilter !== "all" &&
        item.category !== categoryFilter
      ) {
        continue;
      }

      if (
        statusFilter !== "all" &&
        item.status !== statusFilter
      ) {
        continue;
      }

      const searchable =
        `${item.name} ${item.description ?? ""}`.toLowerCase();

      if (
        normalizedSearch !== "" &&
        !searchable.includes(normalizedSearch)
      ) {
        continue;
      }

      const current = grouped.get(item.category) ?? [];
      current.push(item);
      grouped.set(item.category, current);
    }

    return grouped;
  }, [
    categoryFilter,
    parentItems,
    search,
    statusFilter,
  ]);

  const visibleCount = Array.from(groupedItems.values()).reduce(
    (total, categoryItems) => total + categoryItems.length,
    0,
  );

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setSaveError("");
    setDrawerOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item);
    setForm({
      parentItemId: item.parentItemId,
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      status: item.status,
      isSpecial: item.isSpecial,
      isModifier: item.isModifier,
      dietaryFlags: [...item.dietaryFlags],
      sortOrder: item.sortOrder,
    });
    setSaveError("");
    setDrawerOpen(true);
  }

  function closeDrawer() {
    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingItem(null);
    setSaveError("");
  }

  async function saveItem(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSaveError("");

    if (form.name.trim() === "") {
      setSaveError("Name is required.");
      return;
    }

    if (form.category.trim() === "") {
      setSaveError("Category is required.");
      return;
    }

    if (form.isModifier && form.parentItemId === null) {
      setSaveError("Choose a parent item for this modifier.");
      return;
    }

    setSaving(true);

    try {
      if (editingItem) {
        const updated = await updateMenuItem(
          editingItem.id,
          form,
        );

        setItems((current) =>
          current.map((item) =>
            item.id === updated.id ? updated : item,
          ),
        );
      } else {
        const created = await createMenuItem(form);
        setItems((current) => [...current, created]);
      }

      setDrawerOpen(false);
      setEditingItem(null);
    } catch (error: unknown) {
      setSaveError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function toggleItemStatus(item: MenuItem) {
    const nextStatus: MenuItemStatus =
      item.status === "available"
        ? "eighty_sixed"
        : "available";

    try {
      const updated = await updateMenuItem(item.id, {
        status: nextStatus,
      });

      setItems((current) =>
        current.map((candidate) =>
          candidate.id === updated.id ? updated : candidate,
        ),
      );
    } catch (error: unknown) {
      setLoadError(errorMessage(error));
    }
  }

  async function deactivateItem(item: MenuItem) {
    try {
      await deactivateMenuItem(item.id);

      setItems((current) =>
        current.map((candidate) =>
          candidate.id === item.id
            ? { ...candidate, status: "inactive" }
            : candidate,
        ),
      );
    } catch (error: unknown) {
      setLoadError(errorMessage(error));
    }
  }

  function clearFilters() {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
  }

  function toggleCategory(category: string) {
    setCollapsedCategories((current) => {
      const next = new Set(current);

      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }

      return next;
    });
  }

  return (
    <main className="page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Menu Management</h1>
          <p>
            Manage every item, price, modifier, and temporary
            availability change.
          </p>
        </div>

        <button
          className="button" data-variant="primary"
          onClick={openCreate}
          type="button"
        >
          <Plus aria-hidden="true" weight="bold" />
          Add item
        </button>
      </header>

      <section
        aria-label="Menu filters"
        className="filter-bar"
      >
        <label className="search-field">
          <MagnifyingGlass aria-hidden="true" />
          <span className="visually-hidden">Search menu</span>
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search menu"
            type="search"
            value={search}
          />
        </label>

        <label>
          <span className="visually-hidden">Category</span>
          <select
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            value={categoryFilter}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="visually-hidden">Status</span>
          <select
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | MenuItemStatus
                  | "all",
              )
            }
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="eighty_sixed">86’d</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <button
          className="button" data-variant="quiet"
          onClick={clearFilters}
          type="button"
        >
          <ArrowCounterClockwise aria-hidden="true" />
          Reset
        </button>

        <span className="result-count">
          {visibleCount} items
        </span>
      </section>

      {loadError !== "" && (
        <div className="notice notice--error" role="alert">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <SpinnerGap
            aria-hidden="true"
            className="spin"
          />
          Loading menu…
        </div>
      ) : (
        <div className="category-list">
          {Array.from(groupedItems.entries()).map(
            ([category, categoryItems]) => {
              const collapsed =
                collapsedCategories.has(category);

              return (
                <section
                  className="category-card"
                  key={category}
                >
                  <button
                    aria-expanded={!collapsed}
                    className="category-heading"
                    onClick={() => toggleCategory(category)}
                    type="button"
                  >
                    <span>
                      {collapsed ? (
                        <CaretRight aria-hidden="true" />
                      ) : (
                        <CaretDown aria-hidden="true" />
                      )}
                      <strong>{category}</strong>
                    </span>
                    <small>
                      {categoryItems.length} items
                    </small>
                  </button>

                  {!collapsed && (
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Flags</th>
                            <th>
                              <span className="visually-hidden">
                                Actions
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryItems.map((item) => (
                            <MenuRow
                              item={item}
                              key={item.id}
                              modifiers={
                                modifiersByParent.get(item.id) ??
                                []
                              }
                              onDeactivate={deactivateItem}
                              onEdit={openEdit}
                              onStatusToggle={toggleItemStatus}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            },
          )}

          {groupedItems.size === 0 && (
            <div className="empty-state">
              No menu items match these filters.
            </div>
          )}
        </div>
      )}

      {drawerOpen && (
        <div
          className="drawer-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDrawer();
            }
          }}
        >
          <section
            aria-labelledby="menu-drawer-title"
            aria-modal="true"
            className="drawer"
            role="dialog"
          >
            <header className="drawer-heading">
              <div>
                <p className="eyebrow">
                  {editingItem ? "Editing" : "New record"}
                </p>
                <h2 id="menu-drawer-title">
                  {editingItem
                    ? editingItem.name
                    : "Add menu item"}
                </h2>
              </div>
              <button
                aria-label="Close"
                className="icon-button"
                onClick={closeDrawer}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            </header>

            <form className="drawer-form" onSubmit={saveItem}>
              <label>
                <span>Name</span>
                <input
                  autoFocus
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  required
                  value={form.name}
                />
              </label>

              <label>
                <span>Description</span>
                <textarea
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target.value === ""
                          ? null
                          : event.target.value,
                    })
                  }
                  rows={3}
                  value={form.description ?? ""}
                />
              </label>

              <div className="form-grid">
                <label>
                  <span>Category</span>
                  <input
                    list="menu-category-options"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value,
                      })
                    }
                    required
                    value={form.category}
                  />
                  <datalist id="menu-category-options">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </label>

                <label>
                  <span>Price</span>
                  <input
                    min="0"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        price: Number(event.target.value),
                      })
                    }
                    required
                    step="0.01"
                    type="number"
                    value={form.price}
                  />
                </label>
              </div>

              <div className="form-grid">
                <label>
                  <span>Status</span>
                  <select
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target
                          .value as MenuItemStatus,
                      })
                    }
                    value={form.status}
                  >
                    <option value="available">
                      Available
                    </option>
                    <option value="eighty_sixed">
                      86’d
                    </option>
                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                </label>

                <label>
                  <span>Display order</span>
                  <input
                    onChange={(event) =>
                      setForm({
                        ...form,
                        sortOrder: Number(
                          event.target.value,
                        ),
                      })
                    }
                    step="1"
                    type="number"
                    value={form.sortOrder}
                  />
                </label>
              </div>

              <label>
                <span>Item type</span>
                <select
                  onChange={(event) => {
                    const isModifier =
                      event.target.value === "modifier";

                    setForm({
                      ...form,
                      isModifier,
                      parentItemId: isModifier
                        ? form.parentItemId
                        : null,
                    });
                  }}
                  value={
                    form.isModifier ? "modifier" : "base"
                  }
                >
                  <option value="base">Menu item</option>
                  <option value="modifier">
                    Modifier / add-on
                  </option>
                </select>
              </label>

              {form.isModifier && (
                <label>
                  <span>Parent item</span>
                  <select
                    onChange={(event) =>
                      setForm({
                        ...form,
                        parentItemId:
                          event.target.value || null,
                      })
                    }
                    required
                    value={form.parentItemId ?? ""}
                  >
                    <option value="">Choose an item</option>
                    {parentItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label>
                <span>Dietary flags</span>
                <input
                  onChange={(event) =>
                    setForm({
                      ...form,
                      dietaryFlags: event.target.value
                        .split(",")
                        .map((flag) => flag.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="gluten-free, vegetarian"
                  value={form.dietaryFlags.join(", ")}
                />
                <small>Separate flags with commas.</small>
              </label>

              <label className="checkbox-field">
                <input
                  checked={form.isSpecial}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      isSpecial: event.target.checked,
                    })
                  }
                  type="checkbox"
                />
                <span>Feature as a special</span>
              </label>

              {saveError !== "" && (
                <div
                  className="notice notice--error"
                  role="alert"
                >
                  {saveError}
                </div>
              )}

              <footer className="drawer-actions">
                <button
                  className="button" data-variant="primary"
                  disabled={saving}
                  type="submit"
                >
                  {saving && (
                    <SpinnerGap
                      aria-hidden="true"
                      className="spin"
                    />
                  )}
                  {editingItem ? "Save changes" : "Add item"}
                </button>

                <button
                  className="button" data-variant="quiet"
                  disabled={saving}
                  onClick={closeDrawer}
                  type="button"
                >
                  Cancel
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

type MenuRowProps = ItemActionsProps & {
  modifiers: MenuItem[];
};

function MenuRow({
  item,
  modifiers,
  onDeactivate,
  onEdit,
  onStatusToggle,
}: MenuRowProps) {
  return (
    <>
      <tr className={item.status === "inactive" ? "is-muted" : ""}>
        <td>
          <strong>{item.name}</strong>
          {item.description && <small>{item.description}</small>}
        </td>
        <td className="price">${item.price.toFixed(2)}</td>
        <td>
          <StatusBadge status={item.status} />
        </td>
        <td>
          <div className="tag-list">
            {item.isSpecial && <span className="tag">Special</span>}
            {modifiers.length > 0 && (
              <span className="tag">
                {modifiers.length} modifiers
              </span>
            )}
          </div>
        </td>
        <td>
          <ItemActions
            item={item}
            onDeactivate={onDeactivate}
            onEdit={onEdit}
            onStatusToggle={onStatusToggle}
          />
        </td>
      </tr>

      {modifiers.map((modifier) => (
        <tr
          className={`modifier-row ${
            modifier.status === "inactive" ? "is-muted" : ""
          }`}
          key={modifier.id}
        >
          <td>
            <span className="modifier-name">
              ↳ {modifier.name}
            </span>
          </td>
          <td className="price">
            +${modifier.price.toFixed(2)}
          </td>
          <td>
            <StatusBadge status={modifier.status} />
          </td>
          <td>
            <span className="tag">Modifier</span>
          </td>
          <td>
            <ItemActions
              item={modifier}
              onDeactivate={onDeactivate}
              onEdit={onEdit}
              onStatusToggle={onStatusToggle}
            />
          </td>
        </tr>
      ))}
    </>
  );
}
