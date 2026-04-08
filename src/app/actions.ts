"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addFavorite(book: {
  work_key: string;
  title: string;
  author_name: string;
  cover_id: number | null;
  first_publish_year: number | null;
}) {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  // Upsert book into cache table
  await supabase.from("books").upsert(
    {
      work_key: book.work_key,
      title: book.title,
      author_name: book.author_name,
      cover_id: book.cover_id,
      first_publish_year: book.first_publish_year,
    },
    { onConflict: "work_key" }
  );

  // Insert favorite
  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    work_key: book.work_key,
  });

  if (error && error.code !== "23505") {
    // 23505 = unique violation (already favorited)
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/my-books");
}

export async function removeFavorite(work_key: string) {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("work_key", work_key);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/my-books");
}

export async function getUserFavorites(): Promise<string[]> {
  const user = await currentUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favorites")
    .select("work_key")
    .eq("user_id", user.id);

  return data?.map((f) => f.work_key) || [];
}
