"use client";

import { useTransition } from "react";
import { addFavorite, removeFavorite } from "@/app/actions";

type FavoriteButtonProps = {
  workKey: string;
  title: string;
  authorName: string;
  coverId: number | null;
  firstPublishYear: number | null;
  isFavorited: boolean;
  isSignedIn: boolean;
};

export function FavoriteButton({
  workKey,
  title,
  authorName,
  coverId,
  firstPublishYear,
  isFavorited,
  isSignedIn,
}: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  if (!isSignedIn) return null;

  function handleClick() {
    startTransition(async () => {
      if (isFavorited) {
        await removeFavorite(workKey);
      } else {
        await addFavorite({
          work_key: workKey,
          title,
          author_name: authorName,
          cover_id: coverId,
          first_publish_year: firstPublishYear,
        });
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`transition-colors ${isPending ? "opacity-50" : ""}`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorited ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 text-accent"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-muted hover:text-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 5.002A5.5 5.5 0 0 0 16.313 3c-1.497 0-2.874.587-3.879 1.64a.253.253 0 0 1-.368.007l-.066-.07A5.5 5.5 0 0 0 7.688 3C4.714 3 2.25 5.322 2.25 8.25c0 3.925 2.438 7.111 4.739 9.256a25.175 25.175 0 0 0 4.244 3.17c.12.07.24.131.383.218l.022.012.007.004.003.001a.752.752 0 0 0 .704 0l.003-.001.007-.004.022-.012a15.247 15.247 0 0 0 .383-.218 25.18 25.18 0 0 0 4.244-3.17C19.562 15.361 22 12.175 22 8.25c0-1.18-.372-2.273-1.007-3.169"
          />
        </svg>
      )}
    </button>
  );
}
