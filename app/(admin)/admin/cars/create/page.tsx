import AddCarForm from "./_components/add-car-form";

// Make sure the file exists at the specified path, or update the path if necessa
export const metadata = {
  title: "Add new cars | Angelomotive Admin",
  description: "Manage cars in your marketplace",
};

export default function CarsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
      <AddCarForm />
    </div>
  );
}
