import CarList from "./_components/car-list";

export const metadata = {
  title: "Cars | Angelomotive Admin",
  description: "Manage cars in your marketplace",
};

export default function CarsPage() {
  return (
    <div className="py-6 px-8">
      <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
      <CarList />
    </div>
  );
}
