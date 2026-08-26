import type {
  CreateIngredientInput,
  CreateMenuItemInput,
  Ingredient,
  IngredientPopularity,
  MenuCustomizationCatalog,
  MenuGroup,
  MenuItem,
  ReplaceMenuItemCustomizationInput,
  UpdateIngredientInput,
  UpdateMenuItemInput,
  UniversalOffering,
} from "@lazy-janes/shared";

async function readError(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);

  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }

  return `Request failed with status ${response.status}`;
}

export async function getMenuTaxonomy(): Promise<MenuGroup[]> {
  const response = await fetch("/api/menu/taxonomy");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuGroup[]>;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const response = await fetch("/api/menu");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuItem[]>;
}

export async function getNormalizedMenu(): Promise<UniversalOffering[]> {
  const response = await fetch("/api/menu/normalized");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<UniversalOffering[]>;
}

export async function getMenuCustomizationCatalog():
  Promise<MenuCustomizationCatalog> {
  const response = await fetch("/api/menu/customization-catalog");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuCustomizationCatalog>;
}

export async function getMenuIngredientPopularity(
  itemId: string,
): Promise<IngredientPopularity[]> {
  const response = await fetch(`/api/menu/${itemId}/ingredient-popularity`);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<IngredientPopularity[]>;
}

export async function createIngredient(
  input: CreateIngredientInput,
): Promise<Ingredient> {
  const response = await fetch("/api/menu/ingredients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<Ingredient>;
}

export async function updateIngredient(
  ingredientId: string,
  input: UpdateIngredientInput,
): Promise<Ingredient> {
  const response = await fetch(
    `/api/menu/ingredients/${ingredientId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<Ingredient>;
}

export async function replaceMenuItemCustomization(
  itemId: string,
  input: ReplaceMenuItemCustomizationInput,
): Promise<MenuCustomizationCatalog> {
  const response = await fetch(
    `/api/menu/${itemId}/customization`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuCustomizationCatalog>;
}

export async function createMenuItem(
  input: CreateMenuItemInput,
): Promise<MenuItem> {
  const response = await fetch("/api/menu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuItem>;
}

export async function updateMenuItem(
  itemId: string,
  input: UpdateMenuItemInput,
): Promise<MenuItem> {
  const response = await fetch(`/api/menu/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuItem>;
}

export async function deactivateMenuItem(
  itemId: string,
): Promise<void> {
  const response = await fetch(`/api/menu/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
