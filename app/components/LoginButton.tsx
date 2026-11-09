import React from "react";
import { useAuth } from "./AuthProvider";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function LoginButton() {
  const { session, signIn, signOut } = useAuth();
  const user = session?.user;
  const displayName = user?.name ?? "User";

  const handleClick = () => {
    if (user) {
      signOut();
    } else {
      signIn();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-all active:scale-95 cursor-pointer"
      title={user ? `Signed in as ${displayName}` : "Login"}
    >
      {user ? (
        <>
          {/* Avatar circle with initials */}
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs font-bold shadow-inner"
            title={displayName}
          >
            {getInitials(displayName)}
          </span>
          <span className="hidden sm:inline">{displayName}</span>
          <span className="text-xs opacity-70">Logout</span>
        </>
      ) : (
        <>
          {/* Login icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span>Login</span>
        </>
      )}
    </button>
  );
}
