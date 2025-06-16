'use server';
import { db } from '@/drizzle/db';
import { getCurrentUser } from '@/auth/nextjs/currentUser';

async function getBestWorstSleep(): Promise<{
  bestSleep?: number;
  worstSleep?: number;
  error?: string;
}> {
const userId = await getCurrentUser({ withFullUser: true })

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    // Fetch all records for the authenticated user
    const records = await db.query.recordsTable.findMany({
        columns:{amount:true},
        where:(table,{eq}) => eq(table.userId,userId.id)
    })

    if (!records || records.length === 0) {
      return { bestSleep: 0, worstSleep: 0 }; // Return 0 if no records exist
    }

    const amounts = records.map((record) => record.amount);

    // Calculate best and worst sleep amounts
    const bestSleep = Math.max(...amounts); // Highest amount
    const worstSleep = Math.min(...amounts); // Lowest amount

    return { bestSleep, worstSleep };
  } catch (error) {// eslint-disable-line @typescript-eslint/no-unused-vars
    return { error: 'Database error' };
  }
}

export default getBestWorstSleep;