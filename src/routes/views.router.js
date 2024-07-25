import express from "express";
import productsController from "../controllers/products.controller.js";
import messagesController from "../controllers/messages.controller.js";
import {
  logout,
  requestPasswordReset,
  resetPassword,
  cambiarRolPremium,
} from "../controllers/user.controller.js";

const router = express.Router();

// Rutas para vistas de productos
router.get("/products", productsController.getProductsView);
router.get("/realTimeProducts", productsController.getRealTimeProductsView);

// Ruta para cargar la página de chat
router.get("/chat", messagesController.getChatView);

// Rutas para registro y login
router.get("/register", (req, res) => res.render("register"));
router.get("/login", (req, res) => res.render("login"));

// Cerrar sesión
router.post("/logout", logout);

// Solicitud de restablecimiento de contraseña
router.get("/request-password-reset", (req, res) =>
  res.render("request-password-reset")
);
router.post("/request-password-reset", requestPasswordReset);

// Restablecimiento de contraseña
router.get("/reset-password", (req, res) => res.render("reset-password"));
router.post("/reset-password", resetPassword);

// Cambio de rol del usuario
router.post("/cambiar-rol/:uid", cambiarRolPremium);

// Confirmación de envío de restablecimiento de contraseña (ejemplo de una vista)
router.get("/confirmacion-envio", (req, res) => {
  res.render("confirmacion-envio"); // Renderiza la vista de confirmación
});

export default router;
