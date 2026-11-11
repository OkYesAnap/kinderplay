"use client";

import { createSupabaseClient } from "@/lib/supabase/client";
import React, { useCallback, useEffect, useState } from "react";
import Popup from "./Popup";
import { registerUser } from "../utils/registerUser";

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
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");

  const supabase = React.useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session
        ? { user: { id: data.session.user.id, email: data.session.user.email ?? "", user_metadata: data.session.user.user_metadata } }
        : null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const mappedSession = session
        ? { user: { id: session.user.id, email: session.user.email ?? "", user_metadata: session.user.user_metadata } }
        : null;
      setSession(mappedSession);
      setIsLoading(false);

      if (event === "SIGNED_IN" && session) {
        try {
          const result = await registerUser(supabase, session.user);
          if (result.success) {
            setPopupMessage(result.message);
            setPopupType("success");
          } else {
            setPopupMessage(result.message);
            setPopupType("error");
          }
          setPopupVisible(true);
        } catch {
          setPopupMessage("An unexpected error occurred during registration");
          setPopupType("error");
          setPopupVisible(true);
        }
      }
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
      <Popup
        visible={popupVisible}
        message={popupMessage}
        type={popupType}
        onClose={() => setPopupVisible(false)}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
