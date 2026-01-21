import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase-client"; // Import the configured Supabase client

// Defines the shape of the authentication context, nothing else is allowed in or out
interface AuthContextType {
  user: User | null; // Who is signed in or null
  signUpWithEmail: (email: string, password: string) => void; // How to sign up
  signInWithEmail: (email: string, password: string) => void; // How to sign in
  signOut: () => void; // How to sign out
}

// Global authentication context to manage user state 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component that wraps the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // State to hold the current user

  useEffect(() => {
    // Check for existing session on mount, asks Supabase if someone if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null); // Set user if session exists
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null); // Update user state on auth changes
    });

    // Stops listening on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []); // Empty array ensures this runs once on mount

  async function signUpWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173',
    },
  })

    if (error) {
      console.error('Error signing up:', error.message);
      return;
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error signing in:', error.message);
      return;
    }
  }

  const signOut = () => {
    supabase.auth.signOut(); // Supabase sign out
  };


  // Provides these values to the child components 
  return (
    <AuthContext.Provider value={{ user, signUpWithEmail, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext); 
  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider"); // Error if used outside AuthProvider
  }
  return context; // Returns the auth context values
};