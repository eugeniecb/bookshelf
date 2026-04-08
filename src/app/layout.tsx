import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { SyncUser } from "@/components/SyncUser";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookshelf",
  description: "Track and manage your book collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-card-border bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <a
                href="/"
                className="text-xl font-bold tracking-tight hover:text-accent transition-colors"
              >
                Bookshelf
              </a>
              <nav className="flex items-center gap-4 text-sm font-medium">
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
          </header>
          <SyncUser />
          <main className="flex-1">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
