"use client";
import { SessionProvider, useSession as useNextAuthSession, signIn, signOut } from "next-auth/react";
import React, { useCallback } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider
          refetchOnWindowFocus={false}
          refetchInterval={0}
      >
        {children}
      </SessionProvider>
  );
}

export function useAuth() {
  const { data: session, status } = useNextAuthSession();

  const handleSignIn = useCallback(() => {
    signIn("google");
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  return {
    session: session ?? null,
    isLoading: status === "loading",
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
