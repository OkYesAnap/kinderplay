"use client";

import { useEffect, useState } from "react";

interface PopupProps {
  type: "success" | "warning" | "error";
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const styles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    icon: "✓",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-800",
    icon: "⚠",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    icon: "✕",
  },
};

export default function Popup({
  type,
  message,
  visible,
  onClose,
  duration = 5000,
}: PopupProps) {
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!visible) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - 100 / (duration / 50);
      });
    }, 50);

    const timer = setTimeout(() => {
      setIsFading(true);
      clearInterval(progressInterval);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const style = styles[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 ease-in-out ${
        isFading
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      }`}
    >
      <div
        className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 flex items-start gap-3 ${style.text} relative overflow-hidden`}
      >
        <div className="flex-shrink-0 text-xl">{style.icon}</div>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsFading(true);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-lg hover:opacity-75 transition-opacity"
          aria-label="Close notification"
        >
          ×
        </button>

        <div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-75 ease-linear"
          style={{
            width: `${progress}%`,
            transition: "width 50ms linear",
          }}
        />
      </div>
    </div>
  );
}
