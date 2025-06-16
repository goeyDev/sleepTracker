'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you&apos;re looking for doesn&apos;t exist" />
      </Head>

      <div className="h-[50vh] flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
            <p className="mt-4 text-gray-600">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Go to Homepage
            </Link>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Go Back
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            You will be automatically redirected to the homepage in 5 seconds...
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;