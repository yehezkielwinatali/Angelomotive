"use client";
import { getCars } from "@/actions/car-listing";
import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import CarListingsLoading from "./car-listing-loarding";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const CarListings = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 6;

  const search = searchParams.get("search") || "";
  const make = searchParams.get("make") || "";
  const bodyType = searchParams.get("bodyType") || "";
  const fuelType = searchParams.get("fuelType") || "";
  const transmission = searchParams.get("transmission") || "";
  const minPrice = searchParams.get("minPrice") || "0";
  const maxPrice = searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER;
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = searchParams.get("page") || "1";

  const { isLoading, fn: fetchCars, data: result, error } = useFetch(getCars);

  useEffect(() => {
    fetchCars({
      search,
      make,
      bodyType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
    });
  }, [
    search,
    make,
    bodyType,
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    sortBy,
    page,
    limit,
  ]);

  useEffect(() => {
    if (currentPage !== Number(page)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      router.push(`?${params.toString()}`);
    }
  }, [currentPage, searchParams, router]);

  interface HandlePageChange {
    (newPage: number): void;
  }

  const handlePageChange: HandlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  interface GetPaginationUrl {
    (page: number): string;
  }

  const getPaginationUrl: GetPaginationUrl = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };
  if (isLoading && !result) {
    return <CarListingsLoading />;
  }
  if (error || (result && !result.success)) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load cars. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  if (!result || !result.data || result.data.length === 0) {
    return null;
  }
  const { data: cars, pagination } = result;

  return <div></div>;
};

export default CarListings;
