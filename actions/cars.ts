"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { searilizedCarData } from "@/lib/helper";

export async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function processCarImageWithAI(file: File) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Image = await fileToBase64(file);
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    const prompt = `
      Analyze this car image and extract the following information:
      1. Make (manufacturer)
      2. Model
      3. Year (approximately)
      4. Color
      5. Body type (SUV, Sedan, Hatchback, etc.)
      6. Mileage
      7. Fuel type (your best guess)
      8. Transmission type (your best guess)
      9. Price (your best guess)
      9. Short Description as to be added to a car listing

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "model": "",
        "year": 0000,
        "color": "",
        "price": "",
        "mileage": "",
        "bodyType": "",
        "fuelType": "",
        "transmission": "",
        "description": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
    `;

    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    try {
      const carDetails = JSON.parse(cleanedText);
      carDetails.price = carDetails.price.replace(/[^0-9.]/g, "");

      const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "bodyType",
        "price",
        "mileage",
        "fuelType",
        "transmission",
        "description",
        "confidence",
      ];
      const missingFields = requiredFields.filter(
        (field) => !(field in carDetails)
      );
      if (missingFields.length > 0) {
        throw new Error(
          `AI reponse missing fields in response: ${missingFields.join(", ")}`
        );
      }
      return {
        success: true,
        data: carDetails,
      };
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI response:", text);
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.error("Error initializing Google Generative AI:", error);
    throw new Error(
      "Failed to process car image with AI. Please try again later."
    );
  }
}

export async function addCar({
  carData,
  images,
}: {
  carData: any;
  images: any[];
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const carId = uuidv4();
    const folderPath = `cars/${carId}`;
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i];
      if (!base64Data || !base64Data.startsWith("data:image/")) {
        throw new Error("Invalid image file");
      }

      const base64 = base64Data.split(",")[1];
      const imageBuffer = Buffer.from(base64, "base64");

      const mimeMatch = base64Data.match(/^data:(.*?);base64,/);
      const fileExtension = mimeMatch ? mimeMatch[1].split("/")[1] : "jpg";

      const fileName = `image-${Date.now()}-${i}.${fileExtension}`;
      const filePath = `${folderPath}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("car-images")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        throw new Error("Failed to upload image to storage");
      }
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;
      imageUrls.push(publicUrl);
    }
    if (imageUrls.length === 0) {
      throw new Error("No valid images provided");
    }
    const car = await db.car.create({
      data: {
        id: carId,
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        color: carData.color,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        bodyType: carData.bodyType,
        seats: carData.seats,
        description: carData.description,
        status: carData.status,
        featured: carData.featured,
        images: imageUrls,
      },
    });
    revalidatePath("/admin/cars");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error adding car:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function getCars(search = "") {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");
    let where = {};
    if (search) {
      where = {
        OR: [
          { make: { contains: search, mode: "insensitive" } },
          { model: { contains: search, mode: "insensitive" } },
          { color: { contains: search, mode: "insensitive" } },
        ],
      };
    }
    const cars = await db.car.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const searilizedCars = cars.map((car) => searilizedCarData(car));
    return {
      success: true,
      data: searilizedCars,
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function deleteCar(carId: string) {
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

    await db.car.delete({
      where: { id: carId },
    });
    try {
      const cookieStore = cookies();
      const supabase = await createClient(cookieStore);
      const filePaths = car.images
        .map((imageUrl) => {
          const url = new URL(imageUrl);
          const pathMatch = url.pathname.match(/\/car-images\/(.*)/);
          return pathMatch ? pathMatch[1] : null;
        })
        .filter((path): path is string => path !== null);

      if (filePaths.length > 0) {
        const { error } = await supabase.storage
          .from("car-images")
          .remove(filePaths);
        if (error) {
          console.error("Error deleting images from Supabase:", error);
          throw new Error("Failed to delete images from storage");
        }
      }
    } catch (error) {
      console.error("Error deleting images from storage:", error);
    }
    revalidatePath("/admin/cars");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting car:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function updateCarStatus(
  id: string,
  {
    status,
    featured,
  }: { status?: "AVAILABLE" | "SOLD" | "UNAVAILABLE"; featured?: boolean }
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const updateData: {
      status?: "AVAILABLE" | "SOLD" | "UNAVAILABLE";
      featured?: boolean;
    } = {};
    if (status !== undefined) {
      updateData.status = status;
    }
    if (featured !== undefined) {
      updateData.featured = featured;
    }
    await db.car.update({
      where: { id },
      data: updateData,
    });
    revalidatePath("/admin/cars");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating car status:", error);
    return { success: false, error: "Something went wrong" };
  }
}
