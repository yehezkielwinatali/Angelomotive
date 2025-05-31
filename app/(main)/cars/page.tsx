import { getCarFilters } from "@/actions/car-listing";
import React from "react";
import CarListings from "./_components/car-listings";
import { CarFilters } from "./_components/car-filters";

const CarsPage = async () => {
  const filtersData = await getCarFilters();
  return (
    <div className="container mx-auto px-7 py-5">
      <h1 className="text-6xl mb-10 gradient-title">Browse Cars</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0">
          {filtersData.data && <CarFilters filters={filtersData.data} />}
        </div>

        {/* Car Listings */}
        <div className="flex-1">
          <CarListings />
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
