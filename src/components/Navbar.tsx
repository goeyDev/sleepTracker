import { LogOutButton } from '@/auth/nextjs/components/LogOutButton'
import { getCurrentUser } from '@/auth/nextjs/currentUser'
import Link from 'next/link'
import React from 'react'
import NavbarItem from './NavbarItem'

const Navbar = async () => {
  const user = await getCurrentUser({ withFullUser: true })
  
  return (
    <nav >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b-2 border-gray-200 relative z-30">
      {user && (
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-md sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Sleep Tracker
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
           <NavbarItem/>
            <LogOutButton />
          </div>
        </div>
      )}
      </div>
    </nav>
  )
}

export default Navbar