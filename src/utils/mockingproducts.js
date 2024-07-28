//import { faker } from "@faker-js/faker";
//
//const generarProductosMock = async (cantidad = 100) => {
//  const productos = [];
//
//  for (let i = 0; i < cantidad; i++) {
//    const producto = {
//      id: faker.database.mongodbObjectId(),
//      title: faker.commerce.productName(),
//      description: faker.commerce.productDescription(),
//      price: faker.commerce.price(),
//      img: faker.image.urlLoremFlickr({ width: 128 }),
//      code: faker.string.alphanumeric(5),
//      stock: Math.floor(Math.random() * 100),
//      category: faker.commerce.department(),
//      thumbnails: {
//        thumbnail1: faker.image.url({ width: 90 }),
//        thumbnail2: faker.image.url({ width: 90 }),
//      },
//    };
//
//    productos.push(producto);
//  }
//  return productos;
//};
//
//export default generarProductosMock;

import { faker } from "@faker-js/faker";

const generarProductosMock = async (cantidad = 100) => {
  const productos = [];

  for (let i = 0; i < cantidad; i++) {
    const img = faker.image.urlLoremFlickr({ width: 128 });
    const thumbnail1 = faker.image.url({ width: 90 });
    const thumbnail2 = faker.image.url({ width: 90 });

    console.log("Imagen:", img);
    console.log("Thumbnail 1:", thumbnail1);
    console.log("Thumbnail 2:", thumbnail2);

    const producto = {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      img,
      code: faker.string.alphanumeric(5),
      stock: Math.floor(Math.random() * 100),
      category: faker.commerce.department(),
      thumbnails: {
        thumbnail1,
        thumbnail2,
      },
    };

    productos.push(producto);
  }
  return productos;
};

export default generarProductosMock;
