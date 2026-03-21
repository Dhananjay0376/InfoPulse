import { HttpError } from "../lib/http-error.js";
import { createUserRecord, listUserRecords } from "../repositories/users.js";
import { hashPassword } from "./password.js";
import type { AuthUser, UserRole } from "../types/user.js";

interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

function toAuthUser(user: {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

export async function listUsers() {
  const users = await listUserRecords();
  return users.map(toAuthUser);
}

export async function createUser(input: CreateUserInput) {
  const passwordHash = await hashPassword(input.password);

  try {
    const user = await createUserRecord({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      role: input.role,
    });

    return toAuthUser(user);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new HttpError(409, "A user with this email already exists");
    }

    throw error;
  }
}
