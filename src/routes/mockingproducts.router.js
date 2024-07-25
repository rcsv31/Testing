import express from "express";
import generarProductosMock from "../utils/mockingproducts.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const cantidad = Number(req.query.cantidad) || 100;

  try {
    const productos = await generarProductosMock(cantidad);
    res.json(productos);
  } catch (error) {
    console.error("Error generando productos:", error);
    res.status(500).json({ error: "Error al generar productos" });
  }
});

export default router;
