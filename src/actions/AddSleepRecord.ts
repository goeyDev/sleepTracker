"use server";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { db } from "@/drizzle/db";
import { recordsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const recordSchema = z.object({
  text: z.enum(["Refreshed", "Tired", "Neutral", "Exhausted", "Energetic"], {
    required_error: "Please select sleep quality",
  }),
  amount: z.coerce
    .number()
    .min(0.5, "Must sleep at least 0.5 hours")
    .max(12, "Cannot sleep more than 12 hours")
    .refine((val) => val % 0.5 === 0, "Must be in 0.5 hour increments"),
  date: z.coerce
    .date()
    .max(new Date(), "Date cannot be in the future"),
});

type RecordData = z.infer<typeof recordSchema>;

interface RecordResult {
  data?: RecordData;
  error?: string;
  success?: boolean;
}

async function addSleepRecord(formData: FormData): Promise<RecordResult> {
  // 1. Parse and validate input
  const rawData = {
    text: formData.get("text"),
    amount: formData.get("amount"),
    date: formData.get("date"),
  };

  const result = recordSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed: " + result.error.errors.map(e => e.message).join(", "),
    };
  }

  // 2. Get authenticated user
  const userId = await getCurrentUser({ withFullUser: true });
  if (!userId) {
    return { 
      success: false,
      error: "User not found" 
    };
  }

  try {
    // 3. Check for existing record
    const existingRecord = await db.query.recordsTable.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.userId, userId.id),
          eq(table.date, result.data.date)
        ),
    });

    let recordData: RecordData;

    if (existingRecord) {
      // 4. Update existing record
      const [updatedRecord] = await db
        .update(recordsTable)
        .set({ 
          text: result.data.text, 
          amount: result.data.amount 
        })
        .where(eq(recordsTable.id, existingRecord.id))
        .returning();

      recordData = {
        text: updatedRecord.text as "Refreshed" | "Tired" | "Neutral" | "Exhausted" | "Energetic",
        amount: updatedRecord.amount,
        date: updatedRecord.date,
      };
    } else {
      // 5. Create new record
      const [createdRecord] = await db
        .insert(recordsTable)
        .values({
          text: result.data.text,
          amount: result.data.amount,
          date: result.data.date,
          userId: userId.id,
        })
        .returning();

      recordData = {
        text: createdRecord.text as "Refreshed" | "Tired" | "Neutral" | "Exhausted" | "Energetic",
        amount: createdRecord.amount,
        date: createdRecord.date,
      };
    }

    revalidatePath("/");
    return {
      data: recordData,
      success: true
    };
  } catch (error) {// eslint-disable-line @typescript-eslint/no-unused-vars
    return {
      success: false,
      error: "An unexpected error occurred while processing your request.",
    };
  }
}

export default addSleepRecord;