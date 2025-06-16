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

function connectUserToAccount(
  { id, email, name }: { id: string; email: string; name: string },
  provider: OAuthProvider
) {
  return db.transaction(async trx => {
    let user = await trx.query.userTable.findFirst({
      where: eq(userTable.email, email),
      columns: { id: true, role: true },
    })

    if (user == null) {
      const [newUser] = await trx
        .insert(userTable)
        .values({
          email: email,
          name: name,
        })
        .returning({ id: userTable.id, role: userTable.role })
      user = newUser
    }

    await trx
      .insert(userOAuthAccountTable)
      .values({
        provider,
        providerAccountId: id,
        userId: user.id,
      })
      .onConflictDoNothing()

    return user
  })
}