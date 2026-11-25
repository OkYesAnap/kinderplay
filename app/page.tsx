"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import Section from "./components/Section";
import {sections} from "@/app/data/sections";

const sectionIds = sections.map((s) => s.id);

export default function Page() {
    const mainRef = useRef<HTMLElement>(null);
    const [currentHash, setCurrentHash] = useState<string>(() =>
        typeof window !== "undefined" ? window.location.hash.replace("#", "") : ""
    );

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash.replace("#", "") || "");
        };
        window.addEventListener("hashchange", handleHashChange);

        let debounceTimer: ReturnType<typeof setTimeout>;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            if (debounceTimer) return;

            const currentIndex = sectionIds.indexOf(currentHash);
            const direction = e.deltaY > 0 ? 1 : -1;
            let nextIndex = currentIndex + direction;

            // Clamp to valid range
            if (nextIndex < 0) nextIndex = sectionIds.length - 1;
            if (nextIndex >= sectionIds.length) nextIndex = 0;

            const nextId = sectionIds[nextIndex];
            window.location.hash = nextId;

            // Debounce: ignore further wheel events for 300ms
            debounceTimer = setTimeout(() => {
                debounceTimer = undefined as unknown as ReturnType<typeof setTimeout>;
            }, 300);
        };

        const mainEl = mainRef.current;
        mainEl?.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
            mainEl?.removeEventListener("wheel", handleWheel);
            if (debounceTimer) clearTimeout(debounceTimer);
        };
    }, [currentHash]);

    return (
        <main ref={mainRef} className="scroll-snap-y scroll-snap-mandatory overflow-y-auto">
            <Nav/>
            {sections.map((section) => {
                if(section.content) {
                    const CustomSection = section.content;
                    return <CustomSection key={section.id} />;
                } else {
                    return (<Section
                        key={section.id}
                        id={section.id}
                        label={section.label}
                        icon={section.icon}
                        bg={section.bg}
                        gradient={section.gradient}
                        cards={section.cards}
                    />)
                }
            })}
            <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm snap-start">
                <p>&copy; 2026 KinderPlay. All rights reserved.</p>
            </footer>
        </main>
    );
}
