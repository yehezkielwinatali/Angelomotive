"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CarList = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //api
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button
          onClick={() => router.push("/admin/cars/create")}
          className="flex items-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Car
        </Button>
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              value={search}
              placeholder="Search cars..."
              type="search"
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-60"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarList;
