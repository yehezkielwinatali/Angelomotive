"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { serializeCarData } from "@/lib/helper";
interface TestDriveBooking {
  carId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  notes?: string;
}

export async function bookTestDrive({
  carId,
  bookingDate,
  startTime,
  endTime,
  notes,
}: TestDriveBooking) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const car = await db.car.findUnique({
      where: { id: carId },
    });
    if (!car) throw new Error("Car not found");

    const existingBooking = await db.testDriveBooking.findFirst({
      where: {
        carId,
        bookingDate: new Date(bookingDate),
        startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (existingBooking) {
      throw new Error("This car is already booked for the selected time.");
    }

    const booking = await db.testDriveBooking.create({
      data: {
        carId,
        userId: user.id,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        notes: notes || "",
        status: "PENDING",
      },
    });
    revalidatePath(`/test-drive/${carId}`);
    revalidatePath(`cars/${carId}`);
    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error("Error booking test drive:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getUserTestDrives() {
  try {
    const { userId } = await auth();
    if (!userId)
      return {
        success: false,
        error: "Unauthorized",
      };
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user)
      return {
        success: false,
        error: "User not found",
      };

    const bookings = await db.testDriveBooking.findMany({
      where: { userId: user.id },
      include: {
        car: true,
      },
      orderBy: { bookingDate: "desc" },
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      carId: booking.carId,
      car: serializeCarData(booking.car),
      bookingDate: booking.bookingDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));
    return {
      success: true,
      data: formattedBookings,
    };
  } catch (error) {
    console.error("Error fetching user test drives:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function cancelTestDrive(bookingId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");
    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "CANCELLED") {
      return {
        success: false,
        error: "This booking is already cancelled.",
      };
    }
    if (booking.status === "COMPLETED") {
      return {
        success: false,
        error: "This booking is already completed.",
      };
    }
    await db.testDriveBooking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
    });
    revalidatePath("/reservations");
    revalidatePath("/admin/test-drives");
    return {
      succes: true,
      message: "Booking cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling test drive:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
