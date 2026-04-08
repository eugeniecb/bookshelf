import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BookCard } from "@/components/BookCard";
import { BookGrid } from "@/components/BookGrid";
import { RemoveButton } from "@/components/RemoveButton";
import Link from "next/link";

export default async function MyBooksPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select(
      "work_key, created_at, books(title, author_name, cover_id, first_publish_year)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const items = favorites || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          My Books
        </h1>
        <p className="mt-2 text-muted font-body text-sm">
          {items.length === 0
            ? "You haven't saved any books yet."
            : `${items.length} ${items.length === 1 ? "book" : "books"} on your shelf`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="font-display text-5xl text-card-border mb-4">
            &#9758;
          </div>
          <p className="font-display text-xl text-muted font-semibold">
            Nothing here yet
          </p>
          <p className="text-muted mt-2 font-body text-sm mb-8">
            Find books you love and add them to your shelf.
          </p>
          <Link
            href="/search"
            className="inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-body font-semibold text-white hover:bg-accent-hover transition-colors duration-200 shadow-sm"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <BookGrid>
          {items.map((fav, i) => {
            const book = fav.books as unknown as {
              title: string;
              author_name: string;
              cover_id: number | null;
              first_publish_year: number | null;
            };
            return (
              <div
                key={fav.work_key}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <BookCard
                  workKey={fav.work_key}
                  title={book.title}
                  authorName={book.author_name}
                  coverId={book.cover_id}
                  firstPublishYear={book.first_publish_year}
                >
                  <RemoveButton workKey={fav.work_key} />
                </BookCard>
              </div>
            );
          })}
        </BookGrid>
      )}
    </div>
  );
}
