import { getCarById } from "@/actions/car-listing";
import { notFound } from "next/navigation";
import React from "react";
import CarDetails from "./_components/car-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCarById(id);
  if (!result) {
    return {
      title: "Car Not Found",
      description: "The car you are looking for does not exist.",
    };
  }
  const car = result.data;
  return {
    title: `Car Details - ${car.make} ${car.model}`,
    keywords: `${car.make}, ${car.model}, ${car.year}, ${car.color}`,
    description: `Details for car with ID ${id}`,
    openGraph: {
      images: [
        {
          url: car.images[0] || "/default-car-image.jpg",
          alt: `${car.make} ${car.model}`,
        },
      ],
    },
  };
}

const CarPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const result = await getCarById(id);
  if (!result || !result.success) {
    notFound();
  }
  return (
    <div className="container mx-auto px-8 pt-10">
      <CarDetails
        car={result.data}
        testDriveInfo={result?.data?.testDriveInfo}
      />
    </div>
  );
};

export default CarPage;
