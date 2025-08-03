"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

function formatDate(timestamp) {
  if (!timestamp) return "No date";
  try {
    // If already JS Date (might happen in SSR), just return formatted string:
    const date = typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Invalid date";
  }
}

export default function MyNotesPage() {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      // Debug: see your user!
      console.log("Current user:", user.uid);
      const q = query(
        collection(db, "notes"),
        where("userID", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const notesData = [];
          querySnapshot.forEach((doc) => {
            notesData.push({ id: doc.id, ...doc.data() });
          });
          console.log("Fetched notes:", notesData); // WATCH This in your browser console
          setNotes(notesData);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          console.error("Firestore error!", error);
        }
      );
      return () => unsubscribe();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Notes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Notes</h1>
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="flex flex-col dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="truncate">{note.title}</CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                  {formatDate(note.createdAt)}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                  {note.content && typeof note.content === "string"
                    ? note.content.replace(/<[^>]*>?/gm, "")
                    : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          You have not saved any notes yet.
        </p>
      )}
    </div>
  );
}
