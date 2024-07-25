import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("--mode <mode>", "Modo de la aplicación", "development");
program.parse(process.argv);

const mode = program.opts().mode;

dotenv.config({
  path: mode === "produccion" ? "./.env.production" : "./.env.development",
});

const configObject = {
  puerto: process.env.PUERTO,
  mongo_url: process.env.MONGO_URL,
  session_secret: process.env.SESSION_SECRET,
};

export default configObject;
