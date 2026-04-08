import Link from "next/link";
import Image from "next/image";

type BookCardProps = {
  workKey: string;
  title: string;
  authorName?: string;
  coverId?: number | null;
  firstPublishYear?: number | null;
  favoriteCount?: number;
  size?: "default" | "large";
  children?: React.ReactNode; // slot for action buttons (heart, remove, etc.)
};

export function BookCard({
  workKey,
  title,
  authorName,
  coverId,
  firstPublishYear,
  favoriteCount,
  size = "default",
  children,
}: BookCardProps) {
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size === "large" ? "L" : "M"}.jpg`
    : null;

  const isLarge = size === "large";

  return (
    <div
      className={`group relative flex flex-col rounded-xl bg-card border border-card-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-full ${
        isLarge ? "p-5" : "p-3"
      }`}
    >
      <Link href={`/book/${workKey}`} className="block flex-1 flex flex-col">
        <div
          className={`relative mx-auto overflow-hidden rounded-lg bg-amber-50 shadow-inner shrink-0 ${
            isLarge ? "h-72 w-48" : "h-56 w-full"
          }`}
        >
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes={isLarge ? "192px" : "(max-width: 640px) 45vw, (max-width: 768px) 30vw, 20vw"}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted text-sm text-center px-3 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-8 w-8 opacity-40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
              <span className="text-xs">No cover</span>
            </div>
          )}
        </div>
        <div className={`mt-3 flex-1 ${isLarge ? "text-center" : ""}`}>
          <h3
            className={`font-semibold leading-tight line-clamp-2 group-hover:text-accent transition-colors ${
              isLarge ? "text-lg" : "text-sm"
            }`}
          >
            {title}
          </h3>
          {authorName && (
            <p
              className={`text-muted mt-1 line-clamp-1 ${isLarge ? "text-sm" : "text-xs"}`}
            >
              {authorName}
            </p>
          )}
          {firstPublishYear && (
            <p
              className={`text-muted mt-0.5 ${isLarge ? "text-xs" : "text-[11px]"}`}
            >
              {firstPublishYear}
            </p>
          )}
        </div>
      </Link>
      {(children || (favoriteCount !== undefined && favoriteCount > 0)) && (
        <div className="mt-2 flex items-center justify-between shrink-0">
          {favoriteCount !== undefined && favoriteCount > 0 && (
            <span className="text-xs text-muted">
              {favoriteCount} {favoriteCount === 1 ? "favorite" : "favorites"}
            </span>
          )}
          <div className="ml-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
