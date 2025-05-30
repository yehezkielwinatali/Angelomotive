"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getDealershipInfo() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });
    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          workingHours: {
            create: [
              {
                dayOfWeek: "MONDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "TUESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "WEDNESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "THURSDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "FRIDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SATURDAY",
                openTime: "10:00",
                closeTime: "16:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SUNDAY",
                openTime: "10:00",
                closeTime: "16:00",
                isOpen: false,
              },
            ],
          },
        },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    }
    return {
      success: true,
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error fetching dealership info:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function saveWorkingHours(
  workingHours: {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }[]
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");
    const dealership = await db.dealershipInfo.findFirst();
    if (!dealership) {
      throw new Error("Dealership info not found");
    }
    await db.workingHour.deleteMany({
      where: { dealershipId: dealership.id },
    });
    for (const hour of workingHours) {
      await db.workingHour.create({
        data: {
          dealershipId: dealership.id,
          dayOfWeek: hour.dayOfWeek as any,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isOpen: hour.isOpen,
        },
      });
    }
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return {
      success: true,
      message: "Working hours saved successfully",
    };
  } catch (error) {
    console.error("Error saving working hours:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export async function getUsers() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      success: true,
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
  try {
    const { userId: authUserId } = await auth();
    if (!authUserId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: { clerkUserId: authUserId },
    });
    if (!user) throw new Error("User not found");
    await db.user.update({
      where: { clerkUserId: userId },
      data: { role },
    });
    revalidatePath("/admin/settings");
    return {
      success: true,
      message: "User role updated successfully",
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
