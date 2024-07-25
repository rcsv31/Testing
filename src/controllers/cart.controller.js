import cartService from "../services/cart.service.js";
import errorMessages from "../services/errors/custom-error.js";
import { PurchaseCartDTO } from "../dto/carts.dto.js";

export const createCart = async (req, res) => {
  try {
    const createCartDTO = new CreateCartDTO(req.body);
    const newCart = await cartService.createCart(createCartDTO);
    res.status(201).json(newCart);
  } catch (error) {
    const errorMessage =
      errorMessages.cartErrors[error.code] || "Error desconocido.";
    res.status(400).json({ error: errorMessage });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.id);
    res.render("carts", { cart });
  } catch (error) {
    const errorMessage =
      errorMessages.cartErrors[error.code] || "Error desconocido.";
    res.status(404).json({ error: errorMessage });
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
    const errorMessage =
      errorMessages.cartErrors[error.code] || "Error desconocido.";
    res.status(400).json({ error: errorMessage });
  }
};

export const deleteCart = async (req, res) => {
  try {
    await cartService.deleteCart(req.params.id);
    res.render("carts", { message: "Carrito eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.render("carts", { carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const errorMessage =
      errorMessages.cartErrors[error.code] || "Error desconocido.";
    res.status(500).json({ error: errorMessage });
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
    const errorMessage =
      errorMessages.cartErrors[error.code] || "Error desconocido.";
    res.status(500).json({ error: errorMessage });
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
    const errorMessage =
      errorMessages.cartErrors[error.code] || "Error desconocido.";
    res.status(500).json({ error: errorMessage });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.params.id);
    res.render("carts", { cart });
  } catch (error) {
    const errorMessage =
      errorMessages.cartErrors[error.code] || "Error desconocido.";
    res.status(500).json({ error: errorMessage });
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
      // Generar ticket con los datos de la compra
      const ticket = await ticketService.generateTicket(
        result.cart,
        result.purchaseDateTime
      );

      // Limpiar el carrito después de la compra
      const updatedCart = await cartService.clearCart(req.params.cid);

      res.render("ticket", { ticket });
    } else {
      res
        .status(400)
        .json({ productsNotProcessed: result.productsNotProcessed });
    }
  } catch (error) {
    const errorMessage =
      errorMessages.commonErrors[error.code] || "Error desconocido.";
    res.status(500).json({ error: errorMessage });
  }
};
