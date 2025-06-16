'use server';
import { db } from '@/drizzle/db';
import { getCurrentUser } from '@/auth/nextjs/currentUser';

async function getUserRecord(): Promise<{
  record?: number;
  daysWithRecords?: number;
  error?: string;
}> {
   const userId = await getCurrentUser({ withFullUser: true })

  if (!userId) {
    return { error: 'User not found' };
  }

  try {

    const records = await db.query.recordsTable.findMany({
        columns: {
        id: true, // Include id
        text: true,
        amount: true,
        date: true,
        userId: true,},
        where:(table,{eq}) => eq(table.userId,userId.id)
    })
    // const records = await db.record.findMany({
    //   where: { userId },
    // });

    const record = records.reduce((sum, record) => sum + record.amount, 0);

    // Count the number of days with valid sleep records
    const daysWithRecords = records.filter(
      (record) => record.amount > 0
    ).length;

    return { record, daysWithRecords };
  } catch (error) {// eslint-disable-line @typescript-eslint/no-unused-vars
    return { error: 'Database error' };
  }
}

export default getUserRecord;