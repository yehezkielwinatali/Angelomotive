"use client";
import { getCars, updateCarStatus, deleteCar } from "@/actions/cars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/hooks/use-fetch";
import { formatCurrency } from "@/lib/helper";
import {
  CarIcon,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const CarList = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [carToDelete, setCarToDelete] = React.useState<any>(null);

  const {
    data: carsData,
    error: carsError,
    fn: fetchCars,
    isLoading: loadingCars,
  } = useFetch(getCars);

  const {
    error: deleteError,
    fn: deleteCarFn,
    isLoading: deletingCar,
  } = useFetch(deleteCar);

  const {
    error: updateError,
    fn: updateCarStatusFn,
    isLoading: updatingCar,
  } = useFetch(updateCarStatus);

  useEffect(() => {
    fetchCars(search);
  }, [search]);

  useEffect(() => {
    if (carsError) {
      toast.error("Failed to fetch cars. Please try again.");
    }
    if (deleteError) {
      toast.error("Failed to delete car. Please try again.");
    }
    if (updateError) {
      toast.error("Failed to update car status. Please try again.");
    }
  }, [carsError, deleteError, updateError]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCars(search);
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    await deleteCarFn(carToDelete.id);
    setDeleteDialogOpen(false);
    setCarToDelete(null);
    fetchCars(search);
    toast.success("Car deleted successfully");
  };

  interface Car {
    id: string;
    featured: boolean;
  }
  interface CarStatus {
    status: "AVAILABLE" | "SOLD" | "UNAVAILABLE";
  }

  const handleToggleFeatured = async (car: Car) => {
    await updateCarStatusFn(car.id, {
      featured: !car.featured,
    });
    fetchCars(search);
  };

  const handleToggleStatus = async (
    car: Car,
    newStatus: "AVAILABLE" | "SOLD" | "UNAVAILABLE"
  ) => {
    await updateCarStatusFn(car.id, {
      status: newStatus,
    });
    fetchCars(search);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Unavailable
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sold
          </Badge>
        );
      default:
        return <Badge variant={"outline"}>{status}</Badge>;
    }
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

      <Card>
        <CardContent>
          {loadingCars && !carsData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : carsData?.success && carsData.data.length > 0 ? (
            <div className="overflow-x-auto px-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carsData.data.map((car: any) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="w-13 h-13 rounded-md overflow-hidden">
                          {car.images && car.images.length > 0 ? (
                            <Image
                              src={car.images[0]}
                              alt={`${car.make} ${car.model}`}
                              height={40}
                              width={40}
                              className="object-cover w-full h-full"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <CarIcon className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {car.make} {car.model}
                      </TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>{formatCurrency(car.price)}</TableCell>
                      <TableCell>{getStatusBadge(car.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className="p-0 h-9 w-9 cursor-pointer"
                          onClick={() => handleToggleFeatured(car)}
                          disabled={updatingCar}
                        >
                          {car.featured ? (
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            className="cursor-pointer"
                          >
                            <Button
                              variant={"ghost"}
                              size={"sm"}
                              className="p-0 h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/cars/${car.id}`)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleStatus(car, "AVAILABLE")
                              }
                              disabled={
                                updatingCar || car.status === "AVAILABLE"
                              }
                              className="cursor-pointer"
                            >
                              Set as Available
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleStatus(car, "UNAVAILABLE")
                              }
                              disabled={
                                updatingCar || car.status === "UNAVAILABLE"
                              }
                              className="cursor-pointer"
                            >
                              Set as Unavailable
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(car, "SOLD")}
                              disabled={updatingCar || car.status === "SOLD"}
                              className="cursor-pointer"
                            >
                              Set as Sold
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                setCarToDelete(car);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <CarIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">
                No Cars Found
              </h2>
              <p className="text-sm text-gray-500">
                {search
                  ? "No cars match your criteria"
                  : "Your inventory is empty. Add cars to get started"}
              </p>
              <Button
                onClick={() => router.push("/admin/cars/create")}
                className="mt-4"
              >
                Add Your First Car
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure to delete {carToDelete?.make} {carToDelete?.model} (
              {carToDelete?.year})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingCar}
            >
              Cancel
            </Button>
            <Button
              className="ml-2"
              onClick={handleDeleteCar}
              disabled={deletingCar}
            >
              {deletingCar ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Deleting...
                </>
              ) : (
                "Delete Car"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarList;
