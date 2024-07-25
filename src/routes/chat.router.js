import express from "express";
import { isUser } from "../middlewares/authorization";

const router = express.Router();

router.post("/message", isUser, (req, res) => {
  res.send("Mensaje enviado");
});

export default router;
