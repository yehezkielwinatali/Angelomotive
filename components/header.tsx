import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, CarFront, Heart, Layout } from "lucide-react";
import { checkUser } from "@/lib/checkuser";

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={"isAdminPage ? '/admin' : '/'}>"} className="flex">
          <h1 className="font-bold text-xl gradient-title">ANGELOMOTIVE</h1>
          {isAdminPage && (
            <span className="text-xs font-extralight">admin</span>
          )}
        </Link>
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href={"/"}>
              <Button variant={"outline"} className="flex items-center gap-2">
                <ArrowLeft size={18} />
                <span className="hidden md:inline cursor-pointer">
                  Back to App
                </span>
              </Button>
            </Link>
          ) : (
            <SignedIn>
              <Link href={"/saved-cars"}>
                <Button className="cursor-pointer">
                  <Heart size={18} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>
              {!isAdmin ? (
                <Link href={"/reservations"}>
                  <Button variant={"outline"} className="cursor-pointer">
                    <CarFront size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              ) : (
                <Link href={"/admin"}>
                  <Button variant={"outline"} className="cursor-pointer">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}
          <SignedOut>
            <SignInButton forceRedirectUrl={"/"}>
              <Button variant={"outline"} className="cursor-pointer">
                Log In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
