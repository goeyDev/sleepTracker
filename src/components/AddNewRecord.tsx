"use client";

import addSleepRecord from "@/actions/AddSleepRecord";
import React, { useState } from "react";

const AddRecord = () => {
  const [amount, setAmount] = useState(6);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sleepQuality, setSleepQuality] = useState("");
  const [date, setDate] = useState(""); // New state for date

  const clientAction = async (formData: FormData) => {
    setIsLoading(true);
    setAlertMessage(null);

    //no require since const formData = new FormData(e.currentTarget);
    //formData.set("amount", amount.toString());
    //formData.set("text", sleepQuality);
    //formData.set("date", date); // Add date to form data

    const { error} = await addSleepRecord(formData);

    if (error) {
      setAlertMessage(`Error: ${error}`);
      setAlertType("error");
    } else {
      setAlertMessage("Sleep record added successfully!");
      setAlertType("success");
      setAmount(6);
      setSleepQuality("");
      setDate(""); // Reset date
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create FormData from the form element that triggered the submit
    const formData = new FormData(e.currentTarget);

    // display key-value pair object
    // const formDataObject = Object.fromEntries(formData.entries());
    // console.log(formDataObject);

    clientAction(formData);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center hover-scale-shadow">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full">
        <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Track Your Sleep
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sleep Quality and Sleep Date */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Sleep Quality */}
            <div className="flex-1">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sleep Quality
              </label>
              <select
                id="text"
                name="text"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-4 py-2"
                required
              >
                <option value="" disabled>
                  Sleep quality...
                </option>
                <option value="Refreshed">🌞 Refreshed</option>
                <option value="Tired">😴 Tired</option>
                <option value="Neutral">😐 Neutral</option>
                <option value="Exhausted">😫 Exhausted</option>
                <option value="Energetic">⚡ Energetic</option>
              </select>
            </div>

            {/* Sleep Date */}
            <div className="flex-1">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sleep Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-4 py-2"
                placeholder="Select a date"
                required
                onFocus={(e) => e.target.showPicker()}
              />
            </div>
          </div>

          {/* Hours Slept */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hours Slept
              <br />
              <span className="text-xs text-gray-500">
                (Select between 0 and 12 in steps of 0.5)
              </span>
            </label>
            <input
              type="range"
              name="amount"
              id="amount"
              min="0"
              max="12"
              step="0.5"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="text-center text-gray-700 mt-2">{amount} hours</div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-4 py-2 rounded-md font-medium shadow-md transition flex items-center justify-center cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Add Sleep Record"
            )}
          </button>
        </form>

        {/* Alert Message */}
        {alertMessage && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              alertType === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRecord;