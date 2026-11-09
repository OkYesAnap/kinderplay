import { useEffect } from "react";

interface LightboxProps {
  image: string;
  onClose: () => void;
}

export default function Lightbox({ image, onClose }: LightboxProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    // Prevent body scroll while lightbox is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop — fades in */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Image container — scales up */}
      <div className="relative z-10 animate-scale-in w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors focus:outline-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Image */}
        <img
          src={image}
          alt=""
          className="w-full h-[90vh] object-contain rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
}
