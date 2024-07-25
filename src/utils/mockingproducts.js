import { faker } from "@faker-js/faker";

const generarProductosMock = async (cantidad = 100) => {
  const productos = [];

  for (let i = 0; i < cantidad; i++) {
    const producto = {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      img: faker.image.urlLoremFlickr({ width: 128 }),
      code: faker.string.alphanumeric(5),
      stock: Math.floor(Math.random() * 100),
      category: faker.commerce.department(),
      thumbnails: {
        thumbnail1: faker.image.imageUrl({ width: 90 }),
        thumbnail2: faker.image.imageUrl({ width: 90 }),
      },
    };

    productos.push(producto);
  }
  return productos;
};

export default generarProductosMock;
