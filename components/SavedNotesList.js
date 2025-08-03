"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthProvider';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedNotesList() {
  const { user } = useAuth();

  // Local state to hold fetched notes and loading/error status
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only try fetching notes if user is authenticated
    if (user) {
      // Create a Firestore query to fetch notes specific to this user, ordered by latest first
      const q = query(
        collection(db, "notes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      // Start listening to changes using Firestore’s real-time updates
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const notesData = [];
          querySnapshot.forEach((doc) => {
            notesData.push({ id: doc.id, ...doc.data() });
          });

          // Store the notes and clear any previous error
          setNotes(notesData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          // If something goes wrong, catch the error and show it
          console.error("Firestore Error:", err);
          setError("Failed to load notes. Please check the console for details.");
          setLoading(false);
        }
      );

      // Cleanup the listener on unmount
      return () => unsubscribe();
    } else {
      // If user is not logged in, stop loading but don't fetch
      setLoading(false);
    }
  }, [user]);

  // While loading, show skeleton placeholders
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Your Saved Notes
      </h2>

      {/* Show error if fetching fails */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Show notes if available, else show a friendly empty state */}
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800"
            >
              <CardHeader>
                {/* Display the note title, truncate long ones */}
                <CardTitle className="truncate">{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Strip HTML tags from content and limit lines */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {note.content.replace(/<[^>]*>?/gm, '')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Empty state message (only shown if there's no error)
        !error && (
          <p className="text-gray-500 dark:text-gray-400">
            You haven't saved any notes yet. Write a note above and click "Save Note" to get started!
          </p>
        )
      )}
    </section>
  );
}
