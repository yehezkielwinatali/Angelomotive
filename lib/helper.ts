export const searilizedCarData = (car: any, wishlisted = false) => ({
  ...car,
  price: car.price ? parseFloat(car.price.toString()) : 0,
  createdAt: car.createdAt.toISOString(),
  updatedAt: car.updatedAt.toISOString(),
  wishlisted: wishlisted,
});
