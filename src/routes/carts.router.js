import express from "express";
import passport from "passport";
import {
  createCart,
  getCarts,
  getCartById,
  updateCart,
  deleteCart,
  getProductsFromCart,
  addProductToCart,
  deleteProductById,
  clearCart,
} from "../controllers/cart.controller.js";
import { isUser } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/purchase", passport.authenticate("session"), isUser, createCart);
router.get("/", passport.authenticate("session"), isUser, getCarts);
router.get("/:id", passport.authenticate("session"), isUser, getCartById);
router.put("/:id", passport.authenticate("session"), isUser, updateCart);
router.delete("/:id", passport.authenticate("session"), isUser, deleteCart);
router.get(
  "/:id/products",
  passport.authenticate("session"),
  isUser,
  getProductsFromCart
);
router.post(
  "/:id/products",
  passport.authenticate("session"),
  isUser,
  addProductToCart
);
router.delete(
  "/:id/products/:productId",
  passport.authenticate("session"),
  isUser,
  deleteProductById
);
router.post("/:id/clear", passport.authenticate("session"), isUser, clearCart);

export default router;
