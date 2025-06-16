"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavbarItem = () => {
    const currentPathName = usePathname()
  return (
    <div>
      <div>
        <Link
          href="/"
          className={`px-2 py-1 rounded-md text-sm sm:py-2 sm-text-base font-medium transition-color ${currentPathName === "/" ? "text-purple-600 bg-purple-100": "text-gray-700 hover:text-purple-600"}`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`px-2 py-1 rounded-md text-sm sm:py-2 sm-text-base font-medium transition-color ${currentPathName === "/about" ? "text-purple-600 bg-purple-100": "text-gray-700 hover:text-purple-600"}`}
        >
          About
        </Link>
      </div>
    </div>
  );
};

export default NavbarItem;
