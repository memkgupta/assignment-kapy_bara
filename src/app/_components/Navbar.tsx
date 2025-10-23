"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { List, X } from "lucide-react";

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = {
    name: "Admin",
    avatar: "/avatar.png", // placeholder
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              MyBlog
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              href="/home"
              className="text-gray-700 dark:text-gray-200 hover:text-primary"
            >
              Home
            </Link>

            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-200 hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 dark:text-gray-200 hover:text-primary"
            >
              Admin
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Profile
                </Link>
                <Link
                  href="/logout"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Logout
                </Link>
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <List className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-primary">Menu</span>
                </div>
                <div className="flex flex-col space-y-4">
                  <Link
                    href="/home"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary"
                  >
                    Home
                  </Link>

                  <Link
                    href="/admin"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary"
                  >
                    Admin
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/logout"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary"
                  >
                    Logout
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
