import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase-client"; // Import the configured Supabase client
import { useQuery } from "@tanstack/react-query";

// Defines the shape of the authentication context, nothing else is allowed in or out
interface AuthContextType {
  user: User | null; // Who is signed in or null
  role?: "NO_ACCESS" | "USER" | "ADMIN"; // What role they have
  roleLoading: boolean; // Whether the role is currently loading
  roleError: boolean; // Whether there was an error fetching the role
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
  const [user, setUser] = useState<User | null>(null); // State to hold the current use

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
      
      if (error) {
        throw error;
      }
      
      return data.role as "NO_ACCESS" | "USER" | "ADMIN";
  };
  
  const { data: role, isLoading, isError } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: () => fetchUserRole(user!.id), // Calls this function 
    enabled: !!user?.id, // Once user.id is available
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

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
  };


  // Provides these values to the child components 
  return (
    <AuthContext.Provider value={{ 
      user, 
      signUpWithEmail, 
      signInWithEmail, 
      signOut, 
      roleLoading: isLoading,
      roleError: isError,
      role
    }}>
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