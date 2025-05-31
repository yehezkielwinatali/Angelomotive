import { getUserTestDrives } from "@/actions/test-drive";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import ReservationList from "./_components/reservation-list";

export const metadata = {
  title: "Reservation Page | Angelomotive",
  description: "This is the reservation page for Angelomotive",
};

const ReservationPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }
  const reservationResults = await getUserTestDrives();
  return (
    <div className="container mx-auto px-8 py-5">
      <h1 className="text-6xl mb-10 gradient-title">Your Reservations</h1>
      <ReservationList initialData={reservationResults} />
    </div>
  );
};

export default ReservationPage;
