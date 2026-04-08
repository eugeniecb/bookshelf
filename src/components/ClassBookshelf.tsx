"use client";

import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { BookGrid } from "@/components/BookGrid";
import Image from "next/image";

type FavoriteEntry = {
  work_key: string;
  title: string;
  author_name: string;
  cover_id: number | null;
  first_publish_year: number | null;
  user_id: string;
  user_first_name: string | null;
  user_last_name: string | null;
  user_image_url: string | null;
};

type Props = {
  favorites: FavoriteEntry[];
};

function UserAvatar({
  name,
  imageUrl,
  size = 24,
}: {
  name: string;
  imageUrl: string | null;
  size?: number;
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full border-2 border-card"
        style={{ boxShadow: "0 1px 4px var(--warm-shadow)" }}
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-accent text-white font-display font-bold border-2 border-card"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        boxShadow: "0 1px 4px var(--warm-shadow)",
      }}
      title={name}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function getUserDisplayName(
  firstName: string | null,
  lastName: string | null
): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  return "Anonymous";
}

export function ClassBookshelf({ favorites }: Props) {
  const [view, setView] = useState<"unified" | "by-user">("unified");

  // Build unified book list
  const bookMap = new Map<
    string,
    {
      work_key: string;
      title: string;
      author_name: string;
      cover_id: number | null;
      first_publish_year: number | null;
      users: { id: string; name: string; image_url: string | null }[];
    }
  >();

  for (const fav of favorites) {
    const existing = bookMap.get(fav.work_key);
    const userName = getUserDisplayName(fav.user_first_name, fav.user_last_name);
    if (existing) {
      if (!existing.users.some((u) => u.id === fav.user_id)) {
        existing.users.push({
          id: fav.user_id,
          name: userName,
          image_url: fav.user_image_url,
        });
      }
    } else {
      bookMap.set(fav.work_key, {
        work_key: fav.work_key,
        title: fav.title,
        author_name: fav.author_name,
        cover_id: fav.cover_id,
        first_publish_year: fav.first_publish_year,
        users: [
          { id: fav.user_id, name: userName, image_url: fav.user_image_url },
        ],
      });
    }
  }
  const unifiedBooks = Array.from(bookMap.values());

  // Build grouped-by-user data
  const userMap = new Map<
    string,
    {
      name: string;
      image_url: string | null;
      books: {
        work_key: string;
        title: string;
        author_name: string;
        cover_id: number | null;
        first_publish_year: number | null;
      }[];
    }
  >();

  for (const fav of favorites) {
    const userName = getUserDisplayName(fav.user_first_name, fav.user_last_name);
    const existing = userMap.get(fav.user_id);
    const book = {
      work_key: fav.work_key,
      title: fav.title,
      author_name: fav.author_name,
      cover_id: fav.cover_id,
      first_publish_year: fav.first_publish_year,
    };
    if (existing) {
      existing.books.push(book);
    } else {
      userMap.set(fav.user_id, {
        name: userName,
        image_url: fav.user_image_url,
        books: [book],
      });
    }
  }
  const userShelves = Array.from(userMap.entries());

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-center gap-1 mb-10 bg-surface rounded-full p-1 max-w-xs mx-auto">
        <button
          onClick={() => setView("unified")}
          className={`flex-1 rounded-full px-5 py-2 text-sm font-body font-medium transition-all duration-200 ${
            view === "unified"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          All Books
        </button>
        <button
          onClick={() => setView("by-user")}
          className={`flex-1 rounded-full px-5 py-2 text-sm font-body font-medium transition-all duration-200 ${
            view === "by-user"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          By Reader
        </button>
      </div>

      {/* Book count */}
      <p className="text-center text-sm text-muted mb-6 font-body">
        {unifiedBooks.length} {unifiedBooks.length === 1 ? "book" : "books"} on
        the shelf
      </p>

      {view === "unified" ? (
        <BookGrid>
          {unifiedBooks.map((book, i) => (
            <div
              key={book.work_key}
              className="flex flex-col h-full animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <BookCard
                workKey={book.work_key}
                title={book.title}
                authorName={book.author_name}
                coverId={book.cover_id}
                firstPublishYear={book.first_publish_year}
              />
              {/* Readers */}
              <div className="mt-2 px-1 flex items-center gap-1">
                <div className="flex -space-x-1.5">
                  {book.users.slice(0, 4).map((user) => (
                    <UserAvatar
                      key={user.id}
                      name={user.name}
                      imageUrl={user.image_url}
                      size={22}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-muted ml-1.5 font-body">
                  {book.users.length === 1
                    ? book.users[0].name
                    : `${book.users.length} readers`}
                </span>
              </div>
            </div>
          ))}
        </BookGrid>
      ) : (
        <div className="space-y-12">
          {userShelves.map(([userId, shelf], i) => (
            <section
              key={userId}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <UserAvatar
                  name={shelf.name}
                  imageUrl={shelf.image_url}
                  size={40}
                />
                <div>
                  <h2 className="font-display text-xl font-semibold leading-tight">
                    {shelf.name}&apos;s Books
                  </h2>
                  <span className="text-xs text-muted font-body">
                    {shelf.books.length}{" "}
                    {shelf.books.length === 1 ? "book" : "books"}
                  </span>
                </div>
              </div>
              <BookGrid>
                {shelf.books.map((book) => (
                  <BookCard
                    key={book.work_key}
                    workKey={book.work_key}
                    title={book.title}
                    authorName={book.author_name}
                    coverId={book.cover_id}
                    firstPublishYear={book.first_publish_year}
                  />
                ))}
              </BookGrid>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
