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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Books</h1>
          <p className="mt-1 text-muted">
            {items.length === 0
              ? "You haven't saved any books yet."
              : `${items.length} ${items.length === 1 ? "book" : "books"} saved`}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📖</div>
          <p className="text-xl text-muted font-medium">Nothing here yet!</p>
          <p className="text-muted mt-2 mb-6">
            Find books you love and add them to your shelf.
          </p>
          <Link
            href="/search"
            className="inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Search for books
          </Link>
        </div>
      ) : (
        <BookGrid>
          {items.map((fav) => {
            const book = fav.books as unknown as {
              title: string;
              author_name: string;
              cover_id: number | null;
              first_publish_year: number | null;
            };
            return (
              <BookCard
                key={fav.work_key}
                workKey={fav.work_key}
                title={book.title}
                authorName={book.author_name}
                coverId={book.cover_id}
                firstPublishYear={book.first_publish_year}
              >
                <RemoveButton workKey={fav.work_key} />
              </BookCard>
            );
          })}
        </BookGrid>
      )}
    </div>
  );
}
