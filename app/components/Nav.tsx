"use client";

import dynamic from "next/dynamic";

const sections = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "wishes", label: "Wishes", icon: "🎂" },
  { id: "games", label: "Games", icon: "🎮" },
  { id: "movies", label: "Movies", icon: "🎬" },
];

const LoginButton = dynamic(() => import("./LoginButton"), { ssr: false });

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-md border-b border-white/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <span className="text-xl font-bold tracking-tight text-white drop-shadow">
          KinderPlay
        </span>
        <ul className="flex gap-4 items-center">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-all active:scale-95"
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
          <li>
            <LoginButton />
          </li>
        </ul>
      </div>
    </nav>
  );
}
