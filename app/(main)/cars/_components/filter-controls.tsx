"use client";

import { Check, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

type CarFilterControlsProps = {
  filters: any;
  currentFilters: any;
  onFilterChange: (filterName: string, value: any) => void;
  onClearFilter: (filterName: string) => void;
};

const CarFilterControls = ({
  filters,
  currentFilters,
  onFilterChange,
  onClearFilter,
}: CarFilterControlsProps) => {
  const { make, bodyType, fuelType, transmission, priceRange } = currentFilters;
  const filterSections = [
    {
      id: "make",
      title: "Make",
      options: filters.makes.map((make: string) => ({
        label: make,
        value: make,
      })),
      currentValue: make,
      onChange: (value: string) => onFilterChange("make", value),
    },
    {
      id: "bodyType",
      title: "Body Type",
      options: filters.bodyTypes.map((type: string) => ({
        value: type,
        label: type,
      })),
      currentValue: bodyType,
      onChange: (value: string) => onFilterChange("bodyType", value),
    },
    {
      id: "fuelType",
      title: "Fuel Type",
      options: filters.fuelTypes.map((type: string) => ({
        value: type,
        label: type,
      })),
      currentValue: fuelType,
      onChange: (value: string) => onFilterChange("fuelType", value),
    },
    {
      id: "transmission",
      title: "Transmission",
      options: filters.transmissions.map((type: string) => ({
        value: type,
        label: type,
      })),
      currentValue: transmission,
      onChange: (value: string) => onFilterChange("transmission", value),
    },
  ];
  const safePriceRange =
    Array.isArray(priceRange) && priceRange.length === 2
      ? [
          typeof priceRange[0] === "number"
            ? priceRange[0]
            : filters.priceRange.min,
          typeof priceRange[1] === "number"
            ? priceRange[1]
            : filters.priceRange.max,
        ]
      : [filters.priceRange.min, filters.priceRange.max];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Price Range</h3>
        <div className="px-2">
          <Slider
            value={safePriceRange}
            onValueChange={(value) => onFilterChange("priceRange", value)}
            min={filters.priceRange.min}
            max={filters.priceRange.max}
            step={100}
          />
        </div>
        <div className="flex justify-between">
          <div className="font-medium text-sm">${safePriceRange[0]}</div>
          <div className="font-medium text-sm">${safePriceRange[1]}</div>
        </div>
      </div>
      {filterSections.map((section) => (
        <div key={section.id} className="space-y-3">
          <h4 className="text-sm font-medium flex justify-between">
            <span>{section.title}</span>
            {section.currentValue && (
              <button
                className="text-xs text-gray-600 flex items-center"
                onClick={() => onClearFilter(section.id)}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </button>
            )}
          </h4>
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {section.options.map((option: any) => (
              <Badge
                key={option.value}
                variant={
                  section.currentValue === option.value ? "default" : "outline"
                }
                className={`cursor-pointer px-3 py-1 ${
                  section.currentValue === option.value
                    ? "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-200"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  section.onChange(
                    section.currentValue === option.value ? "" : option.value
                  );
                }}
              >
                {option.label}
                {section.currentValue === option.value && (
                  <Check className="ml-1 h-3 w-3 inline" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarFilterControls;
