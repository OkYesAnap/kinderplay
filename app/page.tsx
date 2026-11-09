import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Section from "./components/Section";

const sections = [
  {
    id: "wishes",
    label: "Письмо деду морозу",
    icon: "🎂",
    bg: "/images/wishes-bg.jpg",
    gradient: "from-pink-500/60 to-purple-500/60",
    cards: [
      { title: "Birthday Wishes", description: "Celebrate every special day with joy!", image: "/images/wishes-bg.jpg", targetAmount: 250000, currentAmount: 13233 },
    ],
  },
  {
    id: "games",
    label: "Games",
    icon: "🎮",
    bg: "/images/games-bg.jpg",
    gradient: "from-green-500/60 to-blue-500/60",
    cards: [
      { title: "Memory Match", description: "Test your memory with fun cards!", image: "/images/games-bg.jpg", targetAmount: 1000, currentAmount: 1000 },
      { title: "Puzzle Quest", description: "Solve puzzles and collect stars.", image: "/images/games-bg.jpg", targetAmount: 2000, currentAmount: 1500 },
      { title: "Coloring Book", description: "Unleash your creativity with colors.", image: "/images/games-bg.jpg", targetAmount: 600, currentAmount: 450 },
      { title: "Word Search", description: "Find hidden words in the grid.", image: "/images/games-bg.jpg", targetAmount: 800, currentAmount: 200 },
    ],
  },
  {
    id: "movies",
    label: "Movies",
    icon: "🎬",
    bg: "/images/movies-bg.jpg",
    gradient: "from-orange-500/60 to-red-500/60",
    cards: [
      { title: "Adventure Island", description: "Join a thrilling jungle adventure!", image: "/images/movies-bg.jpg", targetAmount: 3000, currentAmount: 2800 },
      { title: "Space Explorers", description: "Blast off into outer space.", image: "/images/movies-bg.jpg", targetAmount: 1500, currentAmount: 1500 },
      { title: "Magical Kingdom", description: "A fairy tale come to life.", image: "/images/movies-bg.jpg", targetAmount: 2500, currentAmount: 1000 },
      { title: "Ocean Friends", description: "Dive into an underwater world.", image: "/images/movies-bg.jpg", targetAmount: 1800, currentAmount: 900 },

      { title: "Magical Kingdom", description: "A fairy tale come to life.", image: "/images/movies-bg.jpg", targetAmount: 2500, currentAmount: 1000 },
      { title: "Ocean Friends", description: "Dive into an underwater world.", image: "/images/movies-bg.jpg", targetAmount: 1800, currentAmount: 900 },
    ],
  },
];

export default function Home() {
  return (
    <main className="scroll-snap-y scroll-snap-mandatory overflow-y-auto">
      <Nav />
      <Hero />
      {sections.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          label={section.label}
          icon={section.icon}
          bg={section.bg}
          gradient={section.gradient}
          cards={section.cards}
        />
      ))}
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm snap-start">
        <p>&copy; {new Date().getFullYear()} KinderPlay. All rights reserved.</p>
      </footer>
    </main>
  );
}
