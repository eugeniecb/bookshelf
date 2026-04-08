import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getUserFavorites } from "@/app/actions";

type WorkData = {
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  authors?: { author: { key: string } }[];
  first_publish_date?: string;
};

type AuthorData = {
  name: string;
};

async function getWork(key: string): Promise<WorkData> {
  const res = await fetch(`https://openlibrary.org/works/${key}.json`, {
    headers: { "User-Agent": "Bookshelf/1.0" },
  });
  return res.json();
}

async function getAuthor(key: string): Promise<AuthorData> {
  const res = await fetch(`https://openlibrary.org${key}.json`, {
    headers: { "User-Agent": "Bookshelf/1.0" },
  });
  return res.json();
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const [work, { userId }] = await Promise.all([getWork(key), auth()]);

  const userFavorites = userId ? await getUserFavorites() : [];
  const isFavorited = userFavorites.includes(key);

  let authorName = "Unknown author";
  if (work.authors && work.authors.length > 0) {
    const author = await getAuthor(work.authors[0].author.key);
    authorName = author.name;
  }

  const description =
    typeof work.description === "string"
      ? work.description
      : work.description?.value || null;

  const coverId = work.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/search"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-body text-muted hover:text-accent transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3.5 w-3.5"
        >
          <path
            fillRule="evenodd"
            d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
        Back to search
      </Link>

      <div className="mt-4 flex flex-col gap-10 sm:flex-row">
        {/* Cover */}
        <div className="shrink-0">
          <div
            className="relative h-80 w-56 overflow-hidden rounded-lg bg-surface mx-auto sm:mx-0"
            style={{ boxShadow: "0 4px 24px var(--warm-shadow-lg)" }}
          >
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={work.title}
                fill
                className="object-contain"
                sizes="224px"
                priority
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-muted gap-2">
                <span className="font-display text-4xl opacity-30">
                  &#9733;
                </span>
                <span className="text-sm font-body">No cover</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="font-display text-4xl font-bold leading-tight">
            {work.title}
          </h1>
          <p className="mt-2 text-lg text-muted font-body">{authorName}</p>
          {work.first_publish_date && (
            <p className="mt-1 text-sm text-muted/70 font-body">
              First published {work.first_publish_date}
            </p>
          )}

          {/* Favorite button */}
          <div className="mt-5">
            <FavoriteButton
              workKey={key}
              title={work.title}
              authorName={authorName}
              coverId={coverId ?? null}
              firstPublishYear={
                work.first_publish_date
                  ? parseInt(work.first_publish_date)
                  : null
              }
              isFavorited={isFavorited}
              isSignedIn={!!userId}
            />
          </div>

          {/* Description */}
          {description && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold mb-3">
                About this book
              </h2>
              <p className="leading-relaxed text-foreground/80 font-body whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Subjects */}
          {work.subjects && work.subjects.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold mb-3">
                Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {work.subjects.slice(0, 12).map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full bg-surface border border-card-border px-3 py-1 text-xs font-body text-muted"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Open Library link */}
          <a
            href={`https://openlibrary.org/works/${key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-body text-accent hover:text-accent-hover transition-colors duration-200"
          >
            View on Open Library
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path d="M6.22 8.72a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 1 1 1.06 1.06L7.81 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L6.22 8.72Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
