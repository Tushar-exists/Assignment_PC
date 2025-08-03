"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import NoteEditor from '@/components/NoteEditor';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  // Grab the current user and loading state from our custom AuthProvider hook
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Once loading is done, we check if there's a user
    // If not logged in, redirect them to the login page
    if (!loading) {
      if (!user) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // While Firebase (or any backend) is still checking auth state, show a skeleton UI
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-4">
        {/* Simulated loading bars while we fetch user data */}
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Once the user is authenticated, we render the actual dashboard
  if (user) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <section>
          {/* Heading of the dashboard */}
          <h1 className="text-3xl font-bold text-gray-800">
            Smart Note Editor
          </h1>

          {/* Personalized welcome message with user's email */}
          <p className="text-gray-600 mt-1">
            Welcome back, {user.email}! Write a new note or paste your text below.
          </p>
        </section>

        {/* Actual editor component where the user can write notes */}
        <NoteEditor />
      </div>
    );
  }

  // While we’re redirecting (i.e., user is not logged in), show nothing
  return null;
}
