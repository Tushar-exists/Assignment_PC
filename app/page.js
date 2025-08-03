import React from "react";
import {
  Sparkles,
  ChevronRight,
  FileText,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Features array derived from the core assignment requirements
const features = [
  {
    icon: FileText,
    title: "Effortless Note-Taking & Saving",
    description:
      "Utilize a clean user interface with a simple text editor to write your long-form notes and save the raw content with a single click.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Note Refinement",
    description:
      "Use the 'Refine Note' button to let a Large Language Model enhance your note's clarity and style, with the result appearing in its own field.",
  },
  {
    icon: Lightbulb,
    title: "Automatic Title Generation",
    description:
      "Trigger the 'Generate Title' button and have an AI create a fitting title for your note based on its content, orchestrated via LangChain.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative container mx-auto px-4 pt-16 pb-16">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl gradient-title mb-6">
          Transform Your Notes <br /> with the Power of AI.
        </h1>
        <p className="text-lg md:text-xl text-orange-800 dark:text-orange-300 mb-8">
          The Smart Note-taking App that helps you write, refine, and title your thoughts effortlessly. Built with Next.js and LangChain.
        </p>
        
        {/* Visual Preview of the App */}
        <div className="bg-white dark:bg-slate-900 dark:border-slate-700 rounded-2xl p-4 text-left max-full mx-auto shadow-xl border border-orange-100">
          <div className="border-b border-orange-100 dark:border-slate-700 pb-4 mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-white">
              Meeting Recap...
            </h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled>Refine Note</Button>
              <Button size="sm" variant="outline" disabled>Generate Title</Button>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700" disabled>Save</Button>
            </div>
          </div>
          <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
            <p>Today's discussion centered on the Q3 marketing strategy. Key takeaways include a focus on social media engagement and a new content series...</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-8 py-6 rounded-full flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
            >
              Start Writing <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 rounded-full border-orange-600 text-orange-600 hover:bg-orange-100 dark:text-orange-300 dark:border-orange-400 dark:hover:bg-gray-800"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <section
        id="features"
        className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <Card key={index} className="shadow-lg dark:bg-slate-900 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-orange-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-xl text-orange-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-orange-700 dark:text-slate-400">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="space-y-24 mt-24">
        {/* Feature 1 Showcase with Example Text */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-12 w-12 bg-orange-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900 dark:text-white">
              AI-Powered Note Refinement
            </h3>
            <p className="text-lg text-orange-700 dark:text-slate-400">
              Overcome writer's block and improve your text. Our AI, powered by LangChain, will refine your note for better clarity, tone, and style.
            </p>
          </div>
          <div className="space-y-4 bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-xl p-6 border border-orange-100 text-sm">
            <p className="font-medium text-orange-600 dark:text-orange-400">Before AI Refinement:</p>
            <p className="p-2 bg-orange-50 dark:bg-slate-800 rounded-md text-gray-600 dark:text-slate-300">The talk was about our new product. It went good. We should send a mail about it.</p>
            <p className="font-medium text-green-600 dark:text-green-400 pt-4">After AI Refinement:</p>
            <p className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md text-gray-800 dark:text-slate-200">The presentation provided a comprehensive overview of our new product, which was positively received. The next step is to draft a follow-up email to all attendees summarizing the key discussion points.</p>
          </div>
        </div>

        {/* Feature 2 Showcase with Example Text */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:order-2">
            <div className="h-12 w-12 bg-orange-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900 dark:text-white">
              Automatic Title Generation
            </h3>
            <p className="text-lg text-orange-700 dark:text-slate-400">
              No more stressing over headlines. The app uses an LLM to analyze your note and suggest a relevant, catchy title instantly.
            </p>
          </div>
          <div className="space-y-4 bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-xl p-6 border border-orange-100 text-sm md:order-1">
             <p className="font-medium text-orange-600 dark:text-orange-400">Your Note Content:</p>
             <p className="p-2 bg-orange-50 dark:bg-slate-800 rounded-md text-gray-600 dark:text-slate-300">The core idea is to leverage retrieval-augmented generation to reduce hallucinations in large language models...</p>
            <p className="font-medium text-blue-600 dark:text-blue-400 pt-4">AI Generated Title:</p>
            <p className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-md text-gray-800 dark:text-slate-200 font-semibold">Reducing LLM Hallucinations with RAG</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24">
        <Card className="bg-orange-100 dark:bg-slate-900 dark:border-slate-800">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-orange-900 dark:text-white mb-6">
              Ready to Enhance Your Note-Taking?
            </h2>
            <p className="text-lg text-orange-700 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
             Get started now and experience the future of writing with AI assistance.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white animate-bounce">
                Get Started for Free <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}