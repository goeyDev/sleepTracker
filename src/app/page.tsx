import { getCurrentUser } from "@/auth/nextjs/currentUser";
import Link from "next/link";
import Guest from "@/components/guess";
import AddRecord from "@/components/AddNewRecord";
import RecordChart from "@/components/RecordChart";
import AverageSleep from "@/components/AverageSleep";
import BestWorstSleep from "@/components/BestWorstSleep";
import RecordHistory from "@/components/RecordHistory";
import Image from "next/image";

export default async function Home() {
  const user = await getCurrentUser({ withFullUser: true });
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Welcome to Sleep Tracker</h1>
            <div className="flex space-x-4 mb-4">
              <Link
                href="/sign-in"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        {/* Guess */}
        <div className="">
          <Guest />
        </div>
      </div>
    );
  }

  // Logged-in user sees the actual home page
  return (
    <main className="bg-gray-100 text-gray-800 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* User Image */}
            {user.imageUrl && (
              <Image
                src={user.imageUrl}
                alt={`${user.name}&#39;s profile`}
                className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
              />
            )}

            {/* User Details */}
            <div className="flex-1 hover-scale-shadow">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
                Welcome Back, {user.name} 👋
              </h2>
              <p className="text-gray-600 mb-4">
                Here&#39;s a quick overview of your recent sleep activity. Stay
                on top of your data insights and manage your tasks efficiently!
              </p>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Joined:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Last Active:
                  </span>{" "}
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
          {/* Placeholder for AddSleepRecord */}
          <AddRecord />
        </div>

        {/* Right Column */}
        <div className="space-y-6 ">
          {/* Placeholder for RecordStats, RecentRecord, and Insights */}
          <RecordChart />
          <AverageSleep />
          <BestWorstSleep />
        </div>
      </div>
      {/* Placeholder for SleepHistory */}
      <div className="max-w-7xl mx-auto">
        <RecordHistory />
      </div>
    </main>
  );
}
