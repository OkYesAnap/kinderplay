'use client';

interface SpecLinkProps {
  label: string;
  link: string;
}

export default function SpecLink({ label, link }: SpecLinkProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-cyan-700/80 text-white font-medium text-sm hover:bg-cyan-600 transition-colors shadow-md text-center w-full"
    >
      <span className={"font-bold"}>Посмотреть на www.ozon.ru</span>
      <span className="flex items-center gap-2">
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </span>
    </a>
  );
}
