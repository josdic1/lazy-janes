import {
  userRecordSchema,
  usersResponseSchema,
  type CreateUserInput,
  type UpdateUserInput,
  type UserRecord,
  type UsersResponse,
} from "@lazy-janes/shared";

async function readError(
  response: Response,
): Promise<string> {
  const body: unknown = await response
    .json()
    .catch(() => null);

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

export async function getUsers():
  Promise<UsersResponse> {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return usersResponseSchema.parse(
    await response.json(),
  );
}

export async function createUser(
  input: CreateUserInput,
): Promise<UserRecord> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return userRecordSchema.parse(
    await response.json(),
  );
}

export async function updateUser(
  userId: string,
  input: UpdateUserInput,
): Promise<UserRecord> {
  const response = await fetch(
    `/api/users/${userId}`,
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

  return userRecordSchema.parse(
    await response.json(),
  );
}

export async function resetUserPin(
  userId: string,
  pin: string,
): Promise<void> {
  const response = await fetch(
    `/api/users/${userId}/pin`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin }),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
