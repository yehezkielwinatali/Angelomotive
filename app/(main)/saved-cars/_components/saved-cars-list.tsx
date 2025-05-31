import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

type InitialData =
  | {
      success: boolean;
      error: string;
      data?: undefined;
    }
  | {
      success: boolean;
      data: any[];
      error?: undefined;
    };
interface SavedCarsListProps {
  initialData: InitialData;
}

const SavedCarsList = ({ initialData }: SavedCarsListProps) => {
  if (!initialData?.data || initialData?.data.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Heart className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Saved Cars</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven't saved any cars yet. Browse our listings and click the
          heart icon to save cars for later.
        </p>
        <Button variant="default" asChild>
          <Link href="/cars">Browse Cars</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialData?.data?.map((car) => (
        <CarCard key={car.id} car={{ ...car, wishlisted: true }} />
      ))}
    </div>
  );
};

export default SavedCarsList;
