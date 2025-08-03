"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Loader2, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from './AuthProvider';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });


const GOOGLE_API_KEY = "AIzaSyDtl0jhWceCzSQnT88O5Twm-kpu9DFjaOA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

export default function NoteEditor() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [suggestedRefinement, setSuggestedRefinement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true) }, []);

  // This function makes a direct call to the Google Gemini API
  const callGeminiApi = async (task) => {
    setIsLoading(true);
    setError('');

    let prompt;
    if (task === 'refine') {
      prompt = `You are a world-class editor. Refine the following note to improve its clarity, style, and grammar, while preserving the core meaning. Do not add any new information. ORIGINAL NOTE: ${content} REFINED NOTE:`;
    } else {
      prompt = `Based on the following note, generate a single, short, and compelling title. Do not add any extra text or quotation marks. NOTE: ${content} TITLE:`;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const result = data.candidates[0].content.parts[0].text;

      if (task === 'refine') {
        setSuggestedRefinement(result);
      } else {
        setSuggestedTitle(result);
      }

    } catch (err) {
      setError(err.message);
      toast.error(`AI Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTitle = () => {
    setTitle(suggestedTitle);
    setSuggestedTitle('');
  };

  const handleDeclineTitle = () => { setSuggestedTitle('') };

  const handleAcceptRefinement = () => {
    setContent(suggestedRefinement);
    setSuggestedRefinement('');
  };
  
  const handleDeclineRefinement = () => { setSuggestedRefinement('') };

  const handleSaveNote = async () => {
    if (!user) {
      toast.error("You must be logged in to save a note.");
      return;
    }
    setIsSaving(true);
    try {
      await addDoc(collection(db, "notes"), {
        userID: user.uid,
        title: title || "Untitled Note",
        content: content,
        createdAt: serverTimestamp(),
      });
      toast.success("Note saved successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-lg font-semibold">Note Title</label>
        <div className="flex gap-2">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title here..."
            className="flex-grow"
          />
          <Button onClick={() => callGeminiApi('generateTitle')} disabled={isLoading || isSaving || !content} variant="outline">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="ml-2 hidden md:inline">Generate Title</span>
          </Button>
        </div>
      </div>
      {suggestedTitle && (
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-500/20">
          <CardHeader><CardTitle className="text-lg">AI Title Suggestion</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">{suggestedTitle}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAcceptTitle}><Check className="h-4 w-4 mr-2" /> Accept</Button>
              <Button size="sm" variant="outline" onClick={handleDeclineTitle}><X className="h-4 w-4 mr-2" /> Decline</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><CardTitle>Your Note</CardTitle></CardHeader>
        <CardContent>
          {isClient && (
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              style={{ height: '250px', marginBottom: '40px' }} 
            />
          )}
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleSaveNote} disabled={isLoading || isSaving || !content}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSaving ? 'Saving...' : 'Save Note'}
        </Button>
        <Button onClick={() => callGeminiApi('refine')} disabled={isLoading || isSaving || !content}>
          {isLoading ? 'Refining...' : 'Refine Note'}
        </Button>
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}
      {suggestedRefinement && (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/20">
          <CardHeader><CardTitle className="text-lg">AI Refinement Suggestion</CardTitle></CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none p-4 border rounded-md bg-white dark:bg-slate-800 mb-4" dangerouslySetInnerHTML={{ __html: suggestedRefinement }} />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAcceptRefinement}><Check className="h-4 w-4 mr-2" /> Accept</Button>
              <Button size="sm" variant="outline" onClick={handleDeclineRefinement}><X className="h-4 w-4 mr-2" /> Decline</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
