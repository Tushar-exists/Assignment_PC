"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";

const auth = getAuth(app);

export default function Header() {
  const { user } = useAuth();

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error("Sign out error", error);
    });
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b dark:bg-[#0d1117]/80 dark:border-gray-800">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/">
          <Image
            src="/logo.png" 
            alt="Pocket Class Logo"
            width={150}
            height={35}
            priority
            className="block dark:hidden"
          />
          <Image
            src="/logo-dark.png" 
            alt="Pocket Class Logo"
            width={150}
            height={35}
            priority
            className="hidden dark:block"
          />
        </Link>
        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <ThemeToggle /> 
              {/* Add the "My Notes" button here */}
              <Link href="/notes">
                <Button variant="outline">My Notes</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Write New</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}