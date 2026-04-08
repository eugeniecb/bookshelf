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
  children?: React.ReactNode;
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
      className={`group relative flex flex-col rounded-lg bg-card border border-card-border h-full transition-all duration-300 hover:shadow-[0_8px_30px_var(--warm-shadow-lg)] hover:-translate-y-1 ${
        isLarge ? "p-4" : "p-3"
      }`}
      style={{ boxShadow: "0 2px 12px var(--warm-shadow)" }}
    >
      <Link href={`/book/${workKey}`} className="block flex-1 flex flex-col">
        {/* Cover */}
        <div
          className={`relative mx-auto overflow-hidden rounded bg-surface shrink-0 ${
            isLarge ? "h-72 w-48" : "h-56 w-full"
          }`}
        >
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-contain group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              sizes={
                isLarge
                  ? "192px"
                  : "(max-width: 640px) 45vw, (max-width: 768px) 30vw, 20vw"
              }
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted gap-2 px-3">
              <span className="font-display text-3xl opacity-30">&#9733;</span>
              <span className="text-xs font-body">No cover</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className={`mt-3 flex-1 ${isLarge ? "text-center" : ""}`}>
          <h3
            className={`font-display font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200 ${
              isLarge ? "text-xl" : "text-base"
            }`}
          >
            {title}
          </h3>
          {authorName && (
            <p
              className={`text-muted mt-1 line-clamp-1 font-body ${
                isLarge ? "text-sm" : "text-xs"
              }`}
            >
              {authorName}
            </p>
          )}
          {firstPublishYear && (
            <p
              className={`text-muted/60 mt-0.5 font-body ${
                isLarge ? "text-xs" : "text-[11px]"
              }`}
            >
              {firstPublishYear}
            </p>
          )}
        </div>
      </Link>

      {(children || (favoriteCount !== undefined && favoriteCount > 0)) && (
        <div className="mt-2 flex items-center justify-between shrink-0 pt-2 border-t border-card-border/50">
          {favoriteCount !== undefined && favoriteCount > 0 && (
            <span className="text-xs text-muted font-body">
              {favoriteCount} {favoriteCount === 1 ? "favorite" : "favorites"}
            </span>
          )}
          <div className="ml-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
