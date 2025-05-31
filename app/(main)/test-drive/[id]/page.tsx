import { getCarById } from "@/actions/car-listing";
import { notFound } from "next/navigation";
import React from "react";
import TestDriveForm from "../_components/test-drive-form";

export const metadata = {
  title: "Test Drive Page | Angelomotive",
  description: "This is the test drive page for Angelomotive",
};

const TestDrivePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getCarById(id);

  // If car not found, show 404
  if (!result || !result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient-title">Book a Test Drive</h1>
      <TestDriveForm
        car={result.data}
        testDriveInfo={result.data.testDriveInfo}
      />
    </div>
  );
};
export default TestDrivePage;
