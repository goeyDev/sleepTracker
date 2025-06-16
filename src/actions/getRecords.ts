"use server";
import { db } from "@/drizzle/db";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { Record } from "@/types/Record";
import { asc} from "drizzle-orm";
import { recordsTable } from "@/drizzle/schema";

type getRecordsResult ={
  records?:Record[]
  error?:string
}

async function getRecords(): Promise<getRecordsResult> {
  const userId = await getCurrentUser({ withFullUser: true });

  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const records = await db.query.recordsTable.findMany({
      columns: {
        id: true, 
        text: true,
        amount: true,
        date: true,
        userId: true,
        //createdAt: true    // Include createdAt if your Record type requires it
      },
      orderBy: asc(recordsTable.date),
      limit: 10,
      where: (table, { eq }) => eq(table.userId, userId.id),
    });
    // const records = await db.record.findMany({
    //   where: { userId },
    //   orderBy: {
    //     date: 'desc', // Sort by the `date` field in descending order
    //   },
    //   take: 10, // Limit the request to 10 records
    // });

    return { records };
  } catch (error) {// eslint-disable-line @typescript-eslint/no-unused-vars
    return { error: "Database error" };
  }
}

export default getRecords;
