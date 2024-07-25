import mongoose from "mongoose";
import config from "./config/config.js"; // Asegúrate de que esta importación sea correcta

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongo_url, {});
  } catch (error) {
    console.error("Error en la conexión:", error);
  }
};

connectToDatabase();
