"use server"

import { updateUserSessionData } from "@/auth/core/session";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { sessionTable, userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function toggleRole(){
    const user = await getCurrentUser({redirectIfNotFound:true})

    const [updatedUser] = await db.update(userTable).set({role:user.role === 'admin' ? 'user' :'admin'})
    .where(eq(userTable.id,user.id))
    .returning({id:userTable.id,role:userTable.role})

    await db.update(sessionTable).set({user_role:user.role === 'admin' ? 'user' :'admin'})
    .where(eq(sessionTable.user_id,user.id))

    await updateUserSessionData(updatedUser,await cookies())
}