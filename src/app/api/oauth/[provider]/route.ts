/* eslint-disable @typescript-eslint/no-unused-vars */
import { getOAuthClient } from "@/auth/core/oauth/base"
import { createUserSession } from "@/auth/core/session"
import { db } from "@/drizzle/db"

import {
  OAuthProvider,
  oAuthProviders,
  userOAuthAccountTable,
  userTable,
} from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import { z } from "zod"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params
  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const provider = z.enum(oAuthProviders).parse(rawProvider)

  if (typeof code !== "string" || typeof state !== "string") {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again - from Get."
      )}`
    )
  }

  const oAuthClient = getOAuthClient(provider)
  try {
    const oAuthUser = await oAuthClient.fetchUser(code, state, await cookies())
    const user = await connectUserToAccount(oAuthUser, provider)
    await createUserSession(user, await cookies())
  } catch (error) {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again. from Oauth"
      )}`
    )
  }

  redirect("/")
}

async function connectUserToAccount(
  { id, email, name }: { id: string; email: string; name: string },
  provider: OAuthProvider
) {
  // 1. First try to find existing user
  let user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
    columns: { id: true, role: true },
  });

  // 2. Create user if not found
  if (!user) {
    try {
      const [newUser] = await db
        .insert(userTable)
        .values({ email, name })
        .returning({ id: userTable.id, role: userTable.role });
      user = newUser;
    } catch (error) {
      // Handle race condition where user might have been created by another request
      user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
        columns: { id: true, role: true },
      });
      if (!user) {
        throw new Error("User creation failed");
      }
    }
  }

  // 3. Link OAuth account (with conflict handling)
  await db
    .insert(userOAuthAccountTable)
    .values({
      provider,
      providerAccountId: id,
      userId: user.id,
    })
    .onConflictDoNothing();

  return user;
}