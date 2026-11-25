import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Section from "./components/Section";
import MyPc from "./components/MyPc";
import {sections} from "@/app/data/sections";

export default function Home() {
    return (
        <main className="scroll-snap-y scroll-snap-mandatory overflow-y-auto">
            <Nav/>
            <Hero/>
            {sections.reduce<React.ReactNode[]>((acc, section) => {
                if (section.bg && section.gradient && section.cards) {
                    acc.push(
                        <Section
                            key={section.id}
                            id={section.id}
                            label={section.label}
                            icon={section.icon}
                            bg={section.bg}
                            gradient={section.gradient}
                            cards={section.cards}
                        />
                    );
                }
                return acc;
            }, [])}
            <MyPc/>

            <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm snap-start">
                <p>&copy; 2026 KinderPlay. All rights reserved.</p>
            </footer>
        </main>
    );
}
