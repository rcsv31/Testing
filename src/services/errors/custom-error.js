// Estructuramos los errores por tipo y código, utilizando un objeto anidado
const errorMessages = {
  product: {
    missingRequiredFields: "Faltan campos obligatorios para crear el producto.",
    invalidPrice: "El precio del producto debe ser un número válido.",
    invalidStock: "El stock del producto debe ser un número entero válido.",
  },
  cart: {
    productNotFound: "El producto que intentas agregar no se encontró.",
    invalidQuantity:
      "La cantidad del producto debe ser un número entero mayor que cero.",
  },
  user: {
    missingUsername: "El nombre de usuario es obligatorio.",
    invalidEmail: "El correo electrónico no es válido.",
    weakPassword: "La contraseña debe tener al menos 6 caracteres.",
  },
  common: {
    internalError:
      "Ha ocurrido un error interno. Por favor, inténtalo de nuevo más tarde.",
  },
};

export default errorMessages;
