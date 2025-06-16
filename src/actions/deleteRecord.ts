'use server';
import { db } from '@/drizzle/db';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import {Record} from '@/types/Record'
import { revalidatePath } from 'next/cache';
import { recordsTable } from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';

type deleteRecordResult ={
  success:boolean;
  message:string;
  deletedRecords?:Record[];
}

async function deleteRecord(recordId: string): Promise<deleteRecordResult> {
    
const userId = await getCurrentUser({ withFullUser: true })

  if (!userId) {
    return { success: false, message: 'User not found' };
  }

  try {

   // Delete record only if it belongs to the user
    const deletedRecords = await db.delete(recordsTable)
      .where(
        and(
          eq(recordsTable.id, recordId),
          eq(recordsTable.userId, userId.id)
        )
      )
      .returning();
    //prisma  
    // await db.record.delete({
    //   where: {
    //     id: recordId,
    //     userId,
    //   },
    // });

    revalidatePath('/');

     return {
      success: true,
      message: 'Record deleted successfully',
      deletedRecords // Optional: include deleted data
    };
  } catch (error) {// eslint-disable-line @typescript-eslint/no-unused-vars
    return { success:false, message: 'Database error' };
  }
}

export default deleteRecord;