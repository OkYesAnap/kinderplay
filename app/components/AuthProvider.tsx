"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user?: User;
  expires?: string;
}

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        setSession(data);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const signIn = async () => {
    setIsLoading(true);
    window.location.href = "/api/auth/signin/google";
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchSession();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
