import cartService from "../services/cart.service.js";
import errorMessages from "../services/errors/custom-error.js";
import { PurchaseCartDTO } from "../dto/carts.dto.js";

const handleErrorResponse = (res, error, defaultMessage, statusCode = 500) => {
  const errorMessage = errorMessages.cartErrors[error.code] || defaultMessage;
  res.status(statusCode).json({ error: errorMessage });
};

export const createCart = async (req, res) => {
  try {
    const createCartDTO = new CreateCartDTO(req.body);
    const newCart = await cartService.createCart(createCartDTO);
    res.status(201).json(newCart);
  } catch (error) {
    handleErrorResponse(res, error, "Error al crear el carrito.");
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.id);
    res.render("carts", { cart });
  } catch (error) {
    handleErrorResponse(res, error, "Error al obtener el carrito.", 404);
  }
};

export const updateCart = async (req, res) => {
  try {
    const updateCartDTO = new UpdateCartDTO(req.body);
    const updatedCart = await cartService.updateCart(
      req.params.id,
      updateCartDTO
    );
    res.render("carts", { cart: updatedCart });
  } catch (error) {
    handleErrorResponse(res, error, "Error al actualizar el carrito.");
  }
};

export const deleteCart = async (req, res) => {
  try {
    await cartService.deleteCart(req.params.id);
    res.render("carts", { message: "Carrito eliminado con éxito" });
  } catch (error) {
    handleErrorResponse(res, error, "Error al eliminar el carrito.");
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.render("carts", { carts });
  } catch (error) {
    handleErrorResponse(res, error, "Error al obtener los carritos.");
  }
};

export const getProductsFromCart = async (req, res) => {
  try {
    const cart = await cartService.getProductsFromCart(req.params.id);
    if (!cart) {
      res
        .status(404)
        .json({ error: `Carrito no encontrado con ID ${req.params.id}` });
    } else {
      res.render("carts", { cart });
    }
  } catch (error) {
    handleErrorResponse(
      res,
      error,
      "Error al obtener los productos del carrito."
    );
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const addProductToCartDTO = new AddProductToCartDTO(req.body);
    const cart = await cartService.addProductToCart(
      req.params.id,
      addProductToCartDTO
    );
    res.render("carts", { cart });
  } catch (error) {
    handleErrorResponse(res, error, "Error al añadir producto al carrito.");
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const deleteProductByIdDTO = new DeleteProductByIdDTO(req.params);
    const cart = await cartService.deleteProductById(
      req.params.id,
      deleteProductByIdDTO.productId
    );
    res.render("carts", { cart });
  } catch (error) {
    handleErrorResponse(
      res,
      error,
      "Error al eliminar el producto del carrito."
    );
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.params.id);
    res.render("carts", { cart });
  } catch (error) {
    handleErrorResponse(res, error, "Error al vaciar el carrito.");
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const purchaseCartDTO = new PurchaseCartDTO(req.body);
    const result = await cartService.purchaseCart(
      req.params.cid,
      purchaseCartDTO
    );

    if (result.success) {
      const ticket = await ticketService.generateTicket(
        result.cart,
        result.purchaseDateTime
      );

      const updatedCart = await cartService.clearCart(req.params.cid);
      res.render("ticket", { ticket });
    } else {
      res
        .status(400)
        .json({ productsNotProcessed: result.productsNotProcessed });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Error al realizar la compra.");
  }
};
