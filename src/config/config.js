//import dotenv from "dotenv";
//import { Command } from "commander";
//
//const program = new Command();
//program.option("--mode <mode>", "Modo de la aplicación", "development");
//program.parse(process.argv);
//
//const mode = program.opts().mode;
//
//dotenv.config({
//  path: mode === "produccion" ? "./.env.production" : "./.env.development",
//});
//
//const configObject = {
//  puerto: process.env.PUERTO,
//  mongo_url: process.env.MONGO_URL,
//  session_secret: process.env.SESSION_SECRET,
//};
//
//export default configObject;
//

import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("--mode <mode>", "Modo de la aplicación", "development");
program.parse(process.argv);

const mode = program.opts().mode;

console.log(`Modo de aplicación: ${mode}`);

dotenv.config({
  path: mode === "produccion" ? "./.env.production" : "./.env.development",
});

console.log(
  "Archivo de configuración cargado:",
  mode === "produccion" ? ".env.production" : ".env.development"
);

const configObject = {
  puerto: process.env.PUERTO || 3000,
  mongo_url: process.env.MONGO_URL,
  session_secret: process.env.SESSION_SECRET,
};

console.log("Configuración cargada:", configObject);

export default configObject;
