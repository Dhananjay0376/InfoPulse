import { comparePassword } from "../services/password.js";
import { findUserByEmail, findUserById } from "../repositories/users.js";
import { HttpError } from "../lib/http-error.js";
import { signAccessToken } from "../lib/jwt.js";

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user || !user.isActive) {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);

  if (!user || !user.isActive) {
    throw new HttpError(404, "User not found");
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}
