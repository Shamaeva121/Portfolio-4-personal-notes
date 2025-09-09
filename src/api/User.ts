import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
});

export type User = z.infer<typeof UserSchema>;

async function validateResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
}

export async function registerUser(
  username: string,
  password: string,
  email: string
): Promise<void> {
  return fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  })
  .then(validateResponse)
  .then(() => undefined)
}

export async function login(email: string, password: string): Promise<void> {
  return fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(validateResponse)
    .then(() => undefined);
}

export function fetchMe(): Promise<User> {
  return fetch("/api/users/me")
    .then(validateResponse)
    .then((response) => response.json())
    .then((data) => UserSchema.parse(data));
}

export function fetchUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then((response) => response.json())
    .then(data => UserSchema.parse(data))
}