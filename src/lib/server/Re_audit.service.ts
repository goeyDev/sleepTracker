// lib/services/audit.service.ts

import { headers } from 'next/headers';
import { db } from '@/drizzle/db';
import { auditLogTable } from '@/drizzle/schema';

type AuditLogData = {
  userId?: string;
  action: string;
  metadata?: Record<string, unknown>;
};

export async function logAuditEvent(data: AuditLogData) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     headersList.get('x-real-ip') || 
                     'unknown';

    // Handle localhost IPs for development
    const finalIp = ipAddress === '::1' ? '127.0.0.1' : ipAddress;

    await db.insert(auditLogTable).values({
      userId: data.userId,
      action: data.action,
      ipAddress: finalIp,
      userAgent: headersList.get('user-agent') || 'unknown',
      metadata: data.metadata || null,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Consider fallback logging here
  }
}