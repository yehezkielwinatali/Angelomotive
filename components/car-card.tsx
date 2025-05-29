"use client";
import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { CarIcon, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
interface CarProps {
  car: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    transmission: string;
    fuelType: string;
    bodyType: string;
    mileage: number;
    color: string;
    wishlisted: boolean;
  };
}

const CarCard: React.FC<CarProps> = ({ car }) => {
  const [isSaved, setIsSaved] = React.useState(car.wishlisted);
  const handleToggleSave = () => {};
  const router = useRouter();
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group py-0">
      <div className="relative h-48">
        {car.images.length > 0 && car.images ? (
          <div className="relative w-full h-full">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <Button
          variant={"ghost"}
          className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 ${isSaved ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"}`}
          size={"icon"}
          onClick={handleToggleSave}
        >
          <Heart className={isSaved ? "fill-current" : ""} size={20} />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col mb-1">
          <h3 className="text-lg font-bold line-clamp-1">
            {car.make} {car.model}
          </h3>
          <span className="text-xl mb-0 font-bold gradient-title">
            ${car.price.toLocaleString()}
          </span>
        </div>
        <div className="text-gray-600 mb-2 flex items-center">
          <span>{car.year}</span>
          <span className="mx-2">•</span>
          <span>{car.transmission}</span>
          <span className="mx-2">•</span>
          <span>{car.fuelType}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant={"outline"} className="bg-gray-50">
            {car.bodyType}
          </Badge>
          <Badge variant={"outline"} className="bg-gray-50">
            {car.mileage.toLocaleString()} miles
          </Badge>
          <Badge variant={"outline"} className="bg-gray-50">
            {car.color}
          </Badge>
        </div>
        <div className="flex justify-between">
          <Button
            onClick={() => router.push(`/cars/${car.id}`)}
            className="flex-1"
          >
            View Car
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
