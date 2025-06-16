import {
  auditLogTable,
  sessionTable,
  userRoles,
  userTable,
} from "@/drizzle/schema";
import { z } from "zod";
import crypto from "crypto";
import { db } from "@/drizzle/db";
import { and, eq, gt } from "drizzle-orm";

import { getRequestHeaders } from "@/lib/server/headers";

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});

type UserSession = z.infer<typeof sessionSchema>;
export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

export function getUserFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  return getUserSessionById(sessionId);
}

export async function updateUserSessionData(
  user: UserSession,
  cookies: Pick<Cookies, "get" | "set">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
}

export async function createUserSession(
  user: UserSession,
  cookies: Pick<Cookies, "set">
) {
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();

  const userData = sessionSchema.parse(user);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000);

  await db.insert(sessionTable).values({
    session_id: sessionId,
    user_id: userData.id,
    user_role: userData.role,
    expire_at: expiresAt,
  });

  setCookie(sessionId, cookies);
}

export async function removeUserFromSession(
  cookies: Pick<Cookies, "get" | "delete">
) {
  //, forwardedFor, realIp 
  const { ipAddress, userAgent} =
    await getRequestHeaders();

  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  try {
    // 1. Get the session with user info,relations must declare since keyword "with" is use
    const session = await db.query.sessionTable.findFirst({
      where: eq(sessionTable.session_id, sessionId),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            lastLogoutAt: true, // We'll use this as previous logout time
          },
        },
      },
    });

    if (!session) return;

    if (!session?.user) {
      throw new Error("Session or associated user not found");
    }

    const logoutTime = new Date();
    // 2. Calculate session duration (using lastLogoutAt as proxy)
    const sessionDuration = session.user.lastLogoutAt
      ? logoutTime.getTime() - new Date(session.user.lastLogoutAt).getTime()
      : 0; // First session

    await db.transaction(async (tx) => {
      await tx
        .update(userTable)
        .set({ lastLogoutAt: new Date() })
        .where(eq(userTable.id, session.user_id as string));

      await tx
        .delete(sessionTable)
        .where(eq(sessionTable.session_id, sessionId));

      // 5. Create audit log with duration
      await tx.insert(auditLogTable).values({
        userId: session.user_id,
        action: "logout",
        ipAddress,
        userAgent,
        metadata: {
          sessionDurationMs: sessionDuration,
          approximateDuration: sessionDuration > 0, // Flag if duration is estimated
          sessionId,
        },
        createdAt: logoutTime,
      });
    });
  } catch (error) {
    throw error;
  }
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000, // this setting allow the page to active or inactive
  });
}

export async function getUserSessionById(sessionId: string) {
  const results = await db
    .select({
      // user_data: sessionTable.user_data,
      user_id: sessionTable.user_id,
      user_role: sessionTable.user_role,
      expire_at: sessionTable.expire_at,
    })
    .from(sessionTable)
    .where(
      and(
        eq(sessionTable.session_id, sessionId),
        gt(sessionTable.expire_at, new Date()) // ensure session is still valid
      )
    );

  const session = results[0];

  if (!session) return null;

  const user_data = {
    id: session.user_id,
    role: session.user_role,
  };

  const { success, data: user } = sessionSchema.safeParse(user_data);
  return success ? user : null;
}
