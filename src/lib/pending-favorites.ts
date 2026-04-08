const STORAGE_KEY = "bookshelf_pending_favorites";

export type PendingFavorite = {
  work_key: string;
  title: string;
  author_name: string;
  cover_id: number | null;
  first_publish_year: number | null;
};

export function getPendingFavorites(): PendingFavorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPendingFavorite(book: PendingFavorite) {
  const current = getPendingFavorites();
  if (current.some((b) => b.work_key === book.work_key)) return;
  current.push(book);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function removePendingFavorite(workKey: string) {
  const current = getPendingFavorites().filter((b) => b.work_key !== workKey);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function clearPendingFavorites() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isPendingFavorite(workKey: string): boolean {
  return getPendingFavorites().some((b) => b.work_key === workKey);
}
