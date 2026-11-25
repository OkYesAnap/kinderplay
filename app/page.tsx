import Nav from "./components/Nav";
import Section from "./components/Section";
import {sections} from "@/app/data/sections";

export default function Page() {
    return (
        <main className="scroll-snap-y scroll-snap-mandatory overflow-y-auto">
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
