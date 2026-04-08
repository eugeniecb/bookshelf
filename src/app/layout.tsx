import type { Metadata } from "next";
import { Cormorant, Lora } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { SyncUser } from "@/components/SyncUser";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bookshelf",
  description: "A cozy class bookshelf — discover what everyone is reading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lora.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="sticky top-0 z-50 border-b border-card-border bg-card/90 backdrop-blur-md">
            <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-8">
                <a
                  href="/"
                  className="font-display text-2xl font-bold tracking-wide text-foreground hover:text-accent transition-colors"
                >
                  Bookshelf
                </a>
                <nav className="flex items-center gap-6 text-sm font-body font-medium">
                  <a
                    href="/"
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="/search"
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    Search
                  </a>
                  <Show when="signed-in">
                    <a
                      href="/my-books"
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      My Books
                    </a>
                  </Show>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton />
                  <SignUpButton />
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>
          <SyncUser />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-card-border py-6 text-center text-xs text-muted">
            <span className="font-display text-sm tracking-wide">
              Bookshelf
            </span>{" "}
            &middot; A place for readers
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
