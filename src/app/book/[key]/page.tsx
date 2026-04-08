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

  // Get author name
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/search"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
      >
        &larr; Back to search
      </Link>

      <div className="mt-4 flex flex-col gap-8 sm:flex-row">
        {/* Cover */}
        <div className="shrink-0">
          <div className="relative h-80 w-56 overflow-hidden rounded-lg bg-amber-50 shadow-md mx-auto sm:mx-0">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={work.title}
                fill
                className="object-cover"
                sizes="224px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted text-sm">
                No cover
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{work.title}</h1>
          <p className="mt-1 text-lg text-muted">{authorName}</p>
          {work.first_publish_date && (
            <p className="mt-1 text-sm text-muted">
              First published: {work.first_publish_date}
            </p>
          )}

          {/* Favorite button */}
          <div className="mt-4">
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
            <div className="mt-6">
              <h2 className="text-lg font-semibold">About this book</h2>
              <p className="mt-2 leading-relaxed text-foreground/80 whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Subjects */}
          {work.subjects && work.subjects.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Subjects</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {work.subjects.slice(0, 12).map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800"
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
            className="mt-6 inline-block text-sm text-accent hover:text-accent-hover transition-colors"
          >
            View on Open Library &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
