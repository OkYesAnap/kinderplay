type CardSpan = "full" | "wide" | "default";

interface CardProps {
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  span?: CardSpan;
  onImageClick?: (image: string) => void;
}

export default function Card({ title, description, image, targetAmount, currentAmount, span = "default", onImageClick }: CardProps) {
  const isComplete = currentAmount >= targetAmount;
  const percent = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);

  // Adaptive sizing based on card span
  const imageHeight = span === "full" ? "h-64 sm:h-80" : span === "wide" ? "h-48 sm:h-56" : "h-40";
  const titleSize = span === "full" ? "text-2xl" : span === "wide" ? "text-xl" : "text-lg";
  const descSize = span === "full" ? "text-base" : span === "wide" ? "text-sm" : "text-sm";
  const padding = span === "full" ? "p-8" : span === "wide" ? "p-6" : "p-5";
  const btnPadding = span === "full" ? "py-3 text-sm" : span === "wide" ? "py-2.5 text-xs" : "py-2 text-xs";

  return (
    <article
      className={`group rounded-2xl overflow-hidden shadow-lg bg-white/90 backdrop-blur transition-transform hover:-translate-y-2 hover:shadow-xl ${span === "full" ? "max-w-2xl mx-auto" : ""}`}
    >
      <div
        className={`${imageHeight} bg-cover bg-center cursor-pointer transition-transform hover:scale-105 active:scale-95`}
        style={{ backgroundImage: `url(${image})` }}
        onClick={() => onImageClick?.(image)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onImageClick?.(image);
        }}
        aria-label="View image full screen"
      />
      <div className={padding}>
        <h3 className={`font-semibold ${titleSize} mb-1`}>{title}</h3>
        <p className={`${descSize} text-gray-600`}>{description}</p>

        {/* Progress area */}
        <div className="mt-3">
          {isComplete ? (
            <span className={`inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 ${span === "full" ? "text-base" : "text-sm"} font-semibold`}>
              ✔ Success
            </span>
          ) : (
            <>
              <div className={`flex justify-between ${span === "full" ? "text-sm" : "text-xs"} text-gray-500 mb-1`}>
                <span>${currentAmount.toLocaleString()} / ${targetAmount.toLocaleString()}</span>
                <span>{percent}%</span>
              </div>
              <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${span === "full" ? "h-3" : "h-2.5"}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </>
          )}
        </div>

        <a
          href="https://www.donationalerts.com/r/kinderplay"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 block w-full text-center px-4 ${btnPadding} rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity active:scale-95 no-underline`}
        >
          Donate
        </a>
      </div>
    </article>
  );
}
