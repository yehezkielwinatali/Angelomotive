import React from "react";

const CarPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>CarPage : {id}</div>;
};

export default CarPage;
