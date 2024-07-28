//import mongoose from "mongoose";
//import config from "./config/config.js"; // Asegúrate de que esta importación sea correcta
//
//const connectToDatabase = async () => {
//  try {
//    await mongoose.connect(config.mongo_url, {});
//  } catch (error) {
//    console.error("Error en la conexión:", error);
//  }
//};
//
//connectToDatabase();
//

import mongoose from "mongoose";
import config from "./config/config.js";

const connectToDatabase = async () => {
  try {
    if (!config.mongo_url) {
      throw new Error(
        "La URL de MongoDB no está definida. Verifica tu archivo de configuración y asegúrate de que la variable MONGO_URL esté configurada."
      );
    }
    await mongoose.connect(config.mongo_url, {});
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error en la conexión:", error);
  }
};

connectToDatabase();
