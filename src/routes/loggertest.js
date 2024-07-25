import express from "express";
import { createLogger, transports, format } from "winston";
const router = express.Router();

const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(format.timestamp(), format.json()),
});

router.get("/", (req, res) => {
  logger.http("Mensaje http");
  logger.info("Mensaje Info");
  logger.warn("Mensaje Warning");
  logger.error("Mensaje Error");

  res.send("Logs generados");
});

export default router;
