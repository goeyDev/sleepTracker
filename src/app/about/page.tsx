import CapitalizeFirst from '@/components/CapitalizeFirst'
import React from 'react'

const page = () => {
  return (
    <div className="font-sans bg-gray-100 text-gray-800">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-16 px-8 bg-gray-100">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                About SleepTracker
            </h1>
            <p className="text-lg md:text-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Your ultimate companion for tracking sleep and imporving your health.
            </p>
        </section>
        {/* Features Section */}
        <section className="py-16 px-8 bg-gray-100">
            <h2 className="text-3xl font-bold text-center mb-8"><CapitalizeFirst>why choose sleepTracker</CapitalizeFirst></h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-md shadow hover:scale-105 hover-scale-shadow">
                    <h3 className="text-xl font-bold mb-2"><CapitalizeFirst>comprehensive tracking</CapitalizeFirst></h3>
                    <p className="text-gray-600"><CapitalizeFirst>monitor your slepp patterns and identify areas for improvement</CapitalizeFirst></p>
                </div>
                <div className="bg-white p-6 rounded-md shadow hover:scale-105 hover-scale-shadow">
                    <h3 className="text-xl font-bold mb-2"><CapitalizeFirst>personalized insights</CapitalizeFirst></h3>
                    <p className="text-gray-600"><CapitalizeFirst>receive tailored recommendations to enhance your sleep quality.</CapitalizeFirst></p>
                </div>
                <div className="bg-white p-6 rounded-md shadow hover:scale-105 hover-scale-shadow">
                    <h3 className="text-xl font-bold mb-2"><CapitalizeFirst>user friendly design</CapitalizeFirst></h3>
                    <p className="text-gray-600"><CapitalizeFirst>enjoy an intuitive and seamless experience across all devices.</CapitalizeFirst></p>
                </div>
            </div>
        </section>
        {/* Story Section */}
        <section className='py-16 px-8 bg-white'>
        <h2 className='text-3xl font-bold text-center mb-8'>Our Story</h2>
        <p className='text-gray-600 max-w-3xl mx-auto text-center hover-scale-shadow'>
          <CapitalizeFirst>
          SleepTracker was created to address the growing need for better sleep
          management tools. Our team of sleep experts and technologists
          developed a platform that combines cutting-edge technology with
          actionable insights. Since our launch, we’ve helped countless users
          achieve better sleep and improve their overall health.
        </CapitalizeFirst></p>
      </section>

      {/* Call to Action Section */}
      <section className='py-16 px-8 bg-gray-100 text-center'>
        <h2 className='text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          Ready to Sleep Better?
        </h2>
        <p className='text-lg mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>
          Join SleepTracker today and take the first step towards better sleep
          and a healthier life.
        </p>
        {/* <Link
          href='/sign-up'
          className='inline-block bg-white text-purple-600 hover:text-purple-700 px-6 py-3 rounded-md font-medium shadow-md transition'
        >
          Get Started
        </Link> */}
      </section>

    </div>
  )
}

export default page