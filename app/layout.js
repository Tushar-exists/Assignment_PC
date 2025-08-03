import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "react-quill-new/dist/quill.snow.css"; // Styles for the rich text editor

// Load the Inter font from Google Fonts (optimized via next/font)
const inter = Inter({ subsets: ["latin"] });

// Default metadata for the app - useful for SEO and browser tabs
export const metadata = {
  title: "Pocket Class: Smart Note-taking App",
  description: "An AI-powered note-taking app for the Pocket Class assignment.",
};

// Root layout wraps all pages in the app
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply global font and set up background for light and dark themes */}
      <body
        className={`${inter.className} bg-orange-50 dark:bg-[#0d1117]`}
      >
        {/* ThemeProvider enables dark/light mode support using Tailwind's class strategy */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* AuthProvider gives access to user authentication context across the app */}
          <AuthProvider>
            {/* Common header shown on all pages */}
            <Header />

            {/* Main content of the app (where individual pages render) */}
            <main className="min-h-screen">{children}</main>

            {/* Toast notifications with modern UI (provided by Sonner) */}
            <Toaster richColors />

            {/* Simple footer section */}
            <footer className="py-12 bg-transparent">
              <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                <p>Smart Note-taking App Submission</p>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
