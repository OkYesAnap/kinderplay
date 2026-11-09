"use client"
import { useState } from "react";
import Card from "./Card";
import Lightbox from "./Lightbox";

interface CardData {
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
}

interface SectionProps {
  id: string;
  label: string;
  icon: string;
  bg: string;
  gradient: string;
  cards: CardData[];
}

export default function Section({ id, label, icon, bg, gradient, cards }: SectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const count = cards.length;

  // Adaptive grid based on card count
  const gridClass =
    count <= 1
      ? "grid grid-cols-1 max-w-2xl mx-auto"
      : count === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
        : count === 3
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";

  // For 1-2 cards, pass span info so the Card can grow larger
  const cardSpan = count <= 1 ? "full" : count <= 2 ? "wide" : "default";

  return (
    <section
      id={id}
      className="min-h-screen relative flex items-center snap-start"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-24">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-4xl">{icon}</span>
          <h2 className="text-4xl font-bold text-white drop-shadow">{label}</h2>
        </div>

        {/* Cards grid — adaptive based on count */}
        <div className={gridClass}>
          {cards.map((card, i) => (
            <Card key={i} title={card.title} description={card.description} image={card.image} targetAmount={card.targetAmount} currentAmount={card.currentAmount} span={cardSpan} onImageClick={setSelectedImage} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </section>
  );
}
