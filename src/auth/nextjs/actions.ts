"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { OAuthProvider, userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { signInSchema, signUpSchema } from "./schemas";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../core/passwordHasher";
import { createUserSession } from "../core/session";
import { removeUserFromSession } from "../core/session";
import { getOAuthClient } from "../core/oauth/base";
import { db } from "@/drizzle/db";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return "Unable to log you in";

  const user = await db.query.userTable.findFirst({
    columns: { password: true, salt: true, id: true, email: true, role: true },
    where: eq(userTable.email, data.email),
  });

  if (user == null || user.password == null || user.salt == null) {
    return "Unable to log you in";
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword) return "Unable to log you in";
  await createUserSession(user, await cookies());
  redirect("/");
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return "Unable to create account";

  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, data.email),
  });

  if (existingUser != null) return "Account already exists for this email";

  try {
    const salt = generateSalt();

    const hashedPassword = await hashPassword(data.password, salt);

    const [user] = await db
      .insert(userTable)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt,
      })
      .returning({ id: userTable.id, role: userTable.role });

    if (user == null) return "Unable to creare an account!";
  } catch {
    return "Unable to creare an account!";
  }

  redirect("/sign-in");
}

export async function logOut() {
  const cookieStore = await cookies();

  await removeUserFromSession(cookieStore);
  cookieStore.delete("session-id"); // same cookie name you used

  redirect("/"); // or wherever you want after logout
}

export async function oAuthSignIn(provider: OAuthProvider) {
  const oAuthClient = getOAuthClient(provider);
  redirect(oAuthClient.createAuthUrl(await cookies()));
}
