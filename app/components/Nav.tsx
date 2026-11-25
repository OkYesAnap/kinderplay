'use client';

import {useEffect, useState} from "react";
import LoginButton from "@/app/components/LoginButton";
import {useAuth} from "@/app/components/AuthProvider";
import {sections} from "@/app/data/sections";

export default function Nav() {
  useAuth();
  const [selectedId, setSelectedId] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.hash.replace("#", "") || "" : ""
  );

  useEffect(() => {
    const handleHashChange = () => {
      setSelectedId(window.location.hash.replace("#", "") || "");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-xl border-b border-white/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <span className="text-xl font-bold tracking-tight drop-shadow">
          KinderPlay
        </span>
        <ul className="flex gap-4 items-center">
          {sections.map((s) => {
            const isSelected = s.id === selectedId;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold hover:bg-white/30 transition-all active:scale-95 ${
                    isSelected ? "ring-2 ring-inset ring-white" : ""
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </a>
              </li>
            );
          })}
          <li>
            <LoginButton />
          </li>
        </ul>
      </div>
    </nav>
  );
}
