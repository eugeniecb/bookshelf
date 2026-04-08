"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SearchBarProps = {
  defaultValue?: string;
  placeholder?: string;
  navigateTo?: string;
};

export function SearchBar({
  defaultValue = "",
  placeholder = "Search for books...",
  navigateTo,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(
    defaultValue || searchParams.get("q") || ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const target = navigateTo || "/search";
    router.push(`${target}?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-card-border bg-card px-6 py-3.5 pr-14 font-body text-foreground placeholder:text-muted/50 shadow-[0_2px_12px_var(--warm-shadow)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-accent p-2.5 text-white hover:bg-accent-hover transition-colors duration-200 shadow-sm"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
