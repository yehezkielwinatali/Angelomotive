import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "sonner";
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Angelomotive",
  description: "AI powered car marketplace",
  icons: {
    icon: "/angelomotive.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen" suppressHydrationWarning={true}>
            {children}
          </main>
          <Toaster richColors />
          <footer className="bg-blue-50 py-4 ">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p className="gradient-title">&copy;Angelomotive</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
