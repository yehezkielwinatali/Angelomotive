import { getSavedCars } from "@/actions/car-listing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import SavedCarsList from "./_components/saved-cars-list";

const SavedCars = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
  }
  const savedCarResults = await getSavedCars();
  return (
    <div className="container mx-auto px-7 py-5">
      <h1 className="text-6xl mb-10 gradient-title">Your Saved Cars</h1>
      <SavedCarsList initialData={savedCarResults} />
    </div>
  );
};

export default SavedCars;
