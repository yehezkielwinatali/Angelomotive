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
          <footer className="bg-blue-50 py-7 border-t border-blue-100">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700 text-sm">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-bold gradient-title mb-2">
                  Angelomotive
                </h3>
                <p>
                  Discover your perfect ride. Trusted car dealership offering
                  test drives, financing, and more.
                </p>
              </div>

              {/* Navigation Links */}
              <div>
                <h4 className="font-semibold mb-2">Explore</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="/cars" className="hover:text-blue-500 transition">
                      Browse Cars
                    </a>
                  </li>

                  <li>
                    <a href="#faq" className="hover:text-blue-500 transition">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact & Social */}
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:support@angelomotive.com"
                    className="text-blue-600"
                  >
                    support@angelomotive.com
                  </a>
                </p>
                <p>Phone: +1 (800) 123-4567</p>
              </div>
            </div>

            <div className="text-center text-gray-400 text-xs mt-8">
              &copy; {new Date().getFullYear()} Angelomotive. All rights
              reserved.
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
