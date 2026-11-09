"use client";

import { SessionProvider, useSession as useNextAuthSession, signIn, signOut } from "next-auth/react";
import React, { createContext, useContext, useCallback } from "react";

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

/**
 * Internal provider that wraps next-auth's SessionProvider
 * and exposes a simplified auth context to consumers.
 */
function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useNextAuthSession();
  const isLoading = status === "loading";

  const handleSignIn = useCallback(() => {
    signIn("google");
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ session: session ?? null, isLoading, signIn: handleSignIn, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}
                     refetchInterval={0}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
