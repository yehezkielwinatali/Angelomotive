"use server";

import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { create } from "domain";

export async function getCarFilters() {
  try {
    const makes = await db.car.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: {
        make: true,
      },
      distinct: ["make"],
      orderBy: {
        make: "asc",
      },
    });

    const bodyTypes = await db.car.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: {
        bodyType: true,
      },
      distinct: ["bodyType"],
      orderBy: {
        bodyType: "asc",
      },
    });

    const fuelTypes = await db.car.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: {
        fuelType: true,
      },
      distinct: ["fuelType"],
      orderBy: {
        fuelType: "asc",
      },
    });
    const transmissions = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { transmission: true },
      distinct: ["transmission"],
      orderBy: { transmission: "asc" },
    });

    const priceAggregations = await db.car.aggregate({
      where: { status: "AVAILABLE" },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: makes.map((car) => car.make),
        bodyTypes: bodyTypes.map((car) => car.bodyType),
        fuelTypes: fuelTypes.map((car) => car.fuelType),
        transmissions: transmissions.map((car) => car.transmission),
        priceRange: {
          min: priceAggregations._min.price
            ? parseFloat(priceAggregations._min.price.toString())
            : 0,
          max: priceAggregations._max.price
            ? parseFloat(priceAggregations._max.price.toString())
            : 100000,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching car filters:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getCars({
  search = "",
  make = "",
  bodyType = "",
  fuelType = "",
  transmission = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest",
  page = 1,
  limit = 6,
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    let dbuser = null;
    dbuser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    let where: any = {
      status: "AVAILABLE",
    };
    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (make) {
      where.make = { equals: make, mode: "insensitive" };
    }
    if (bodyType) {
      where.bodyType = { equals: bodyType, mode: "insensitive" };
    }
    if (fuelType) {
      where.fuelType = { equals: fuelType, mode: "insensitive" };
    }
    if (transmission) {
      where.transmission = { equals: transmission, mode: "insensitive" };
    }
    where.price = {
      gte: parseFloat(minPrice.toString()) || 0,
    };
    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      where.price.lte = parseFloat(maxPrice.toString());
    }
    const skip = (page - 1) * limit;
    let orderBy = {};
    switch (sortBy) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
        break;
    }
    const totalCars = await db.car.count({ where });
    const cars = await db.car.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });
    let wishlisted = new Set();
    if (dbuser) {
      const savedCars = await db.userSavedCar.findMany({
        where: { userId: dbuser.id },
        select: { carId: true },
      });
      wishlisted = new Set(savedCars.map((sc) => sc.carId));
    }
    const serializedCars = cars.map((car) =>
      serializeCarData(car, wishlisted.has(car.id))
    );
    return {
      success: true,
      data: serializedCars,
      pagination: {
        total: totalCars,
        page,
        limit,
        pages: Math.ceil(totalCars / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function toggleSavedCar(carId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }
    const car = await db.car.findUnique({
      where: { id: carId },
    });
    if (!car) {
      return {
        success: false,
        error: "Car not found",
      };
    }
    const existingSave = await db.userSavedCar.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    });
    if (existingSave) {
      await db.userSavedCar.delete({
        where: {
          userId_carId: {
            userId: user.id,
            carId,
          },
        },
      });
      return {
        success: true,
        saved: false,
        message: "Car removed from wishlist",
      };
    } else {
      await db.userSavedCar.create({
        data: {
          userId: user.id,
          carId,
        },
      });
      return {
        success: true,
        saved: true,
        message: "Car added to wishlist",
      };
    }
  } catch (error) {
    console.error("Error toggling saved car:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getCarById(carId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    const dbUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!dbUser) {
      return {
        success: false,
        error: "User not found",
      };
    }
    const car = await db.car.findUnique({
      where: { id: carId },
    });
    if (!car) {
      return {
        success: false,
        error: "Car not found",
      };
    }
    let isWishlisted = false;
    if (dbUser) {
      const wishlistedCar = await db.userSavedCar.findUnique({
        where: {
          userId_carId: {
            userId: dbUser.id,
            carId,
          },
        },
      });
      isWishlisted = !!wishlistedCar;
    }
    const existingTestDrive = await db.testDriveBooking.findFirst({
      where: {
        carId,
        userId: dbUser.id,
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      },
      orderBy: { bookingDate: "desc" },
    });
    let userTestDrive = null;
    if (existingTestDrive) {
      userTestDrive = {
        id: existingTestDrive.id,
        bookingDate: existingTestDrive.bookingDate.toISOString(),
        status: existingTestDrive.status,
      };
    }
    const dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });
    return {
      success: true,
      data: {
        ...serializeCarData(car, isWishlisted),
        testDriveInfo: {
          userTestDrive,
          dealership: dealership
            ? {
                ...dealership,
                createdAt: dealership.createdAt.toISOString(),
                updatedAt: dealership.updatedAt.toISOString(),
                workingHours: dealership.workingHours.map((wh) => ({
                  ...wh,
                  createdAt: wh.createdAt.toISOString(),
                  updatedAt: wh.updatedAt.toISOString(),
                })),
              }
            : null,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching car by ID:", error);
  }
}

async function getSavedCars() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }
    const savedCars = await db.userSavedCar.findMany({
      where: { userId: user.id },
      include: {
        car: true,
      },
      orderBy: {
        savedAt: "desc",
      },
    });

    const cars = savedCars.map((sc) => serializeCarData(sc.car, true));

    return {
      success: true,
      data: cars,
    };
  } catch (error) {
    console.error("Error fetching saved cars:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
