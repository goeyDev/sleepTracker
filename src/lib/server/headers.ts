'use server';
// Function to retrieve visitor information

import { headers } from 'next/headers';
import { cache } from 'react';

export type RequestHeaders = {
  ipAddress: string;
  userAgent: string;
  forwardedFor?: string;
  realIp?: string;
};

export const getRequestHeaders = cache(async (): Promise<RequestHeaders> => {
  const headersList = await headers();
  return {
    ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown',
    userAgent: headersList.get('user-agent') || 'unknown',
    //forwardedFor: headersList.get('x-forwarded-for') || undefined,
    //realIp: headersList.get('x-real-ip') || undefined,
    // Add any other headers you need
    // referer: headersList.get('referer'),
    // acceptLanguage: headersList.get('accept-language'),
  };
});