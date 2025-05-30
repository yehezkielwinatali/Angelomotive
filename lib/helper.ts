export const serializeCarData = (car: any, wishlisted = false) => ({
  ...car,
  price: car.price ? parseFloat(car.price.toString()) : 0,
  createdAt: car.createdAt.toISOString(),
  updatedAt: car.updatedAt.toISOString(),
  wishlisted: wishlisted,
});

export const formatCurrency = (amount: any) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
