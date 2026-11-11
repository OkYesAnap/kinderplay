"use client";

import { createSupabaseClient } from "@/lib/supabase/client";
import React, { useCallback, useEffect, useState } from "react";

type AuthContextType = {
  session: { user: { id: string; email: string; user_metadata: Record<string, unknown> } } | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextType>({
  session: null,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthContextType["session"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = React.useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session
        ? { user: { id: data.session.user.id, email: data.session.user.email ?? "", user_metadata: data.session.user.user_metadata } }
        : null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session
        ? { user: { id: session.user.id, email: session.user.email ?? "", user_metadata: session.user.user_metadata } }
        : null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignIn = useCallback(() => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  }, [supabase]);

  const handleSignOut = useCallback(() => {
    supabase.auth.signOut();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn: handleSignIn, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
