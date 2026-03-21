import { HttpError } from "../lib/http-error.js";
import {
  createUserRecord,
  listUserRecords,
  updateUserPassword,
  updateUserRecord,
} from "../repositories/users.js";
import { hashPassword } from "./password.js";
import type { AuthUser, UserRole } from "../types/user.js";

interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

interface UpdateUserInput {
  userId: string;
  role: UserRole;
  isActive: boolean;
}

interface ResetPasswordInput {
  userId: string;
  password: string;
}

function toAuthUser(user: {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive?: boolean;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
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

export async function updateUser(input: UpdateUserInput) {
  const user = await updateUserRecord(input);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return toAuthUser(user);
}

export async function resetUserPassword(input: ResetPasswordInput) {
  const passwordHash = await hashPassword(input.password);
  const user = await updateUserPassword(input.userId, passwordHash);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return toAuthUser(user);
}
