import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { SearchBar } from "@/components/SearchBar";
import { ClassBookshelf } from "@/components/ClassBookshelf";

type FavoriteRow = {
  work_key: string;
  user_id: string;
  books: {
    title: string;
    author_name: string;
    cover_id: number | null;
    first_publish_year: number | null;
  };
  users: {
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
};

async function getAllFavorites() {
  const { data } = await supabase
    .from("favorites")
    .select(
      "work_key, user_id, created_at, books(title, author_name, cover_id, first_publish_year), users(first_name, last_name, image_url)"
    )
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) return [];

  return (data as unknown as FavoriteRow[]).map((row) => ({
    work_key: row.work_key,
    title: row.books.title,
    author_name: row.books.author_name,
    cover_id: row.books.cover_id,
    first_publish_year: row.books.first_publish_year,
    user_id: row.user_id,
    user_first_name: row.users.first_name,
    user_last_name: row.users.last_name,
    user_image_url: row.users.image_url,
  }));
}

export default async function HomePage() {
  const favorites = await getAllFavorites();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Class Bookshelf
        </h1>
        <p className="mt-3 text-lg text-muted max-w-lg mx-auto">
          Every book our class is reading — all in one place. Search, discover,
          and share your favorites.
        </p>
        <div className="mt-8">
          <Suspense>
            <SearchBar navigateTo="/search" placeholder="Search for books..." />
          </Suspense>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-xl text-muted font-medium">
            The shelf is empty!
          </p>
          <p className="text-muted mt-2">
            Search for a book and be the first to add one.
          </p>
        </div>
      ) : (
        <ClassBookshelf favorites={favorites} />
      )}
    </div>
  );
}
