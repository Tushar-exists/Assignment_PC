"use client"; // Ensures this component runs on the client side where hooks like useState are allowed

import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase"; // Importing the initialized Firebase app
import { Button } from "@/components/ui/button"; // Using custom styled button
import { Input } from "@/components/ui/input";   // Using custom styled input

// Initialize the Firebase auth instance using our app
const auth = getAuth(app);

export default function SignUp() {
  // Track user input for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // For showing feedback to the user
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handles form submission when user clicks "Sign Up"
  const handleSignUp = async (event) => {
    event.preventDefault(); // Prevent page reload
    setError(null);   // Clear old error messages
    setSuccess(null); // Clear old success messages

    try {
      // Create a new account using Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Account created successfully! You can now log in."); // Inform user
    } catch (err) {
      // Something went wrong — maybe email is already in use or password is too weak
      setError(err.message);
    }
  };

  return (
    <form 
      onSubmit={handleSignUp} 
      className="space-y-4 max-w-sm mx-auto p-8 border rounded-lg"
    >
      {/* Page title */}
      <h2 className="text-2xl font-bold">Create Account</h2>

      {/* Email input */}
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state on change
          placeholder="name@example.com"
          required
        />
      </div>

      {/* Password input */}
      <div>
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          placeholder="Must be at least 6 characters"
          required
        />
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full">Sign Up</Button>
      
      {/* Show success message if account is created */}
      {success && <p className="text-green-600 mt-2">{success}</p>}
      
      {/* Show error message if something goes wrong */}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
