"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Calendar, Car, Clock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface BookingUser {
  name?: string;
  email?: string;
}

interface Booking {
  id: string;
  carId: string;
  car: {
    make: string;
    model: string;
    year: number | string;
    images?: string[];
  };
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  user?: BookingUser;
}

interface TestDriveCardProps {
  booking: Booking;
  onCancel?: (id: string) => Promise<void> | void;
  showActions?: boolean;
  isPast?: boolean;
  isAdmin?: boolean;
  isCancelling?: boolean;
  renderStatusSelector?: () => React.ReactNode;
  cancelError?: string;
}

// Helper function to format time
const formatTime = (timeString: string) => {
  try {
    return format(parseISO(`2022-01-01T${timeString}`), "h:mm a");
  } catch (error) {
    return timeString;
  }
};

// Helper function for status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
    case "CONFIRMED":
      return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
    case "COMPLETED":
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
    case "CANCELLED":
      return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
    case "NO_SHOW":
      return <Badge className="bg-red-100 text-red-800">No Show</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Define types for booking and user

export function TestDriveCard({
  booking,
  onCancel,
  showActions = true,
  isPast = false,
  isAdmin = false,
  isCancelling = false,
  renderStatusSelector = () => null,
}: TestDriveCardProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Handle cancel
  const handleCancel = async () => {
    if (!onCancel) return;

    await onCancel(booking.id);
    setCancelDialogOpen(false);
  };

  return (
    <>
      <Card
        className={`overflow-hidden ${
          isPast ? "opacity-80 hover:opacity-100 transition-opacity" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row px-4">
          {/* Car Image - Left */}
          <div className="sm:w-1/4 relative h-40 sm:h-auto">
            {booking.car.images && booking.car.images.length > 0 ? (
              <div className="relative w-full h-full">
                <Image
                  src={booking.car.images[0]}
                  alt={`${booking.car.make} ${booking.car.model}`}
                  fill
                  className="object-cover "
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Car className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="absolute top-2 right-2 sm:hidden">
              {getStatusBadge(booking.status)}
            </div>
          </div>

          {/* Booking Details - Middle */}
          <div className="p-4 sm:w-1/2 sm:flex-1">
            <div className="hidden sm:block mb-2">
              {getStatusBadge(booking.status)}
            </div>

            <h3 className="text-lg font-bold mb-1">
              {booking.car.year} {booking.car.make} {booking.car.model}{" "}
            </h3>
            {renderStatusSelector()}

            <div className="space-y-2 my-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </div>

              {/* Show customer info in admin view */}
              {isAdmin && booking.user && (
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {booking.user.name || booking.user.email}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Right */}
          {showActions && (
            <div className="p-4 space-y-2 border-t sm:border-t-0 sm:border-l sm:w-1/4 sm:flex sm:flex-col sm:justify-center sm:items-center sm:space-y-2">
              {/* Show notes if any */}
              {booking.notes && (
                <div className="bg-gray-50 p-2 rounded text-sm w-full">
                  <p className="font-medium">Notes:</p>
                  <p className="text-gray-600">{booking.notes}</p>
                </div>
              )}
              <div className="w-full mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full my-2 sm:mb-0"
                  asChild
                >
                  <Link
                    href={`/cars/${booking.carId}`}
                    className="flex items-center justify-center"
                  >
                    View Car
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {(booking.status === "PENDING" ||
                booking.status === "CONFIRMED") && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cancel"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Cancel Confirmation Dialog */}
      {onCancel && (
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Test Drive</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your test drive for the{" "}
                {booking.car.year} {booking.car.make} {booking.car.model}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>
                    {format(
                      new Date(booking.bookingDate),
                      "EEEE, MMMM d, yyyy"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
                disabled={isCancelling}
                className="cursor-pointer"
              >
                Keep Reservation
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isCancelling}
                className="cursor-pointer"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Reservation"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
