import { UserSavedCar } from "./lib/generated/prisma";
enum CarStatus {
  AVAILABLE,
  UNAVAILABLE,
  SOLD,
}
enum UserRole {
  USER,
  ADMIN,
}
enum BookingStatus {
  PENDING,
  CONFIRMED,
  COMPLETED,
  CANCELLED,
  NO_SHOW,
}

export type CarType = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number; // `Decimal` in Prisma maps to `number` in most use-cases
  mileage: number;
  color: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  seats?: number;
  description: string;
  status: CarStatus; // import this from Prisma if enum
  featured: boolean;
  images: string[]; // array of Supabase URLs
  savedBy: UserSavedCar[]; // define UserSavedCar separately
  testDriveBookings: TestDriveBooking[]; // define TestDriveBooking separately
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  clerkUserId: string;
  email: string;
  name?: string;
  imageUrl?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole; // Enum: ADMIN, USER, etc.
  savedCars: UserSavedCar[]; // Define or import this type
  testDrives: TestDriveBooking[]; // Define or import this type
};
export type TestDriveBooking = {
  id: string;
  carId: string;
  car: CarType; // Make sure you define or import the `Car` type
  userId: string;
  user: User; // Define or import the `User` type
  bookingDate: Date; // Date only (no time)
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  status: BookingStatus; // Enum: PENDING, APPROVED, REJECTED, etc.
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  dealership?: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
  } | null; // Optional dealership info
  existingBooking?: TestDriveBooking[]; // Optional, for existing bookings on the same date
  timeSlot?: string; // Optional, for specific time slots
  isAvailable?: boolean; // Optional, for availability checks
};

export type DealershipInfo = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: WorkingHour[];
  createdAt: Date;
  updatedAt: Date;
};

export type WorkingHour = {
  id: string;
  dealershipId: string;
  dealership: DealershipInfo;
  dayOfWeek: string; // You may want to define a DayOfWeek enum/type
  openTime: string; // Format: "HH:MM" (24-hour)
  closeTime: string; // Format: "HH:MM" (24-hour)
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
};
