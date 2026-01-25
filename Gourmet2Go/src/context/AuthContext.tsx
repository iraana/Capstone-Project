import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase-client"; // Import the configured Supabase client

// Defines the shape of the authentication context, nothing else is allowed in or out
interface AuthContextType {
  user: User | null; // Who is signed in or null
  role: "NO_ACCESS" | "USER" | "ADMIN" | null; // What role they have
  signUpWithEmail: (params: { 
    email: string, 
    password: string, 
    options: { data: {first_name: string, last_name: string } }
  }) => Promise<{ data: any; error: any }>; // How to sign up
  signInWithEmail: (email: string, password: string) => void; // How to sign in
  signOut: () => void; // How to sign out
}

// Global authentication context to manage user state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component that wraps the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // State to hold the current user
  const [role, setRole] = useState<"NO_ACCESS" | "USER" | "ADMIN" | null>(null); // State to hold the user's role

  const fetchUserRole = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
      
      if (error) {
        setRole(null); // Set to null on error as a fallback
        return;
      }
      
      setRole(data.role); 
  }, []);

  useEffect(() => {
    // Check for existing session on mount, asks Supabase if someone if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null; 
      setUser(currentUser); // Set user if session exists

      if (currentUser) {
        fetchUserRole(currentUser.id);
      } else {
        setRole(null);
      }
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser); // Update user state on auth changes

      if (currentUser) {  
        fetchUserRole(currentUser.id);
      } else {
        setRole(null);
      }
    });

    // Stops listening on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []); // Empty array ensures this runs once on mount

  async function signUpWithEmail({
    email,
    password,
    options
  } : {
    email: string;
    password: string;
    options: {
      data: {
        first_name: string;
        last_name: string;
      };
    };
  }) {
    const { first_name, last_name } = options.data; 
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173',
        data: {
          first_name,
          last_name,
        },
      },
    });

    return { data, error };

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

  const signOut = async () => {
    supabase.auth.signOut(); // Supabase sign out
    setUser(null); // Clear user state
    setRole(null); // Reset role on sign out
  };


  // Provides these values to the child components 
  return (
    <AuthContext.Provider value={{ user, signUpWithEmail, signInWithEmail, signOut, role }}>
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