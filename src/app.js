import express from "express";
import expressHandlebars from "express-handlebars";
import { Server as SocketIOServer } from "socket.io";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import expressCompression from "express-compression";
import config from "./config/config.js";
import createSessionMiddleware from "./middlewares/session.js";
import { addLogger, logger } from "./utils/logger.js";
import MessageModel from "./models/message.model.js";
import "./database.js"; // Importar el archivo de conexión
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();

console.log("Mongo URL:", config.mongo_url); // Verifica que esta variable no es undefined

app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressCompression({
    brotli: {
      enabled: true,
      zlib: {},
    },
  })
);

app.use(
  createSessionMiddleware(
    config.mongo_url,
    config.session_secret,
    config.isProduction
  )
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

const hbs = expressHandlebars.create({
  defaultLayout: "main",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(addLogger);

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/session.router.js";
import mockingProductsRouter from "./routes/mockingproducts.router.js";
import loggertestRouter from "./routes/loggertest.js";

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/mockingproducts", mockingProductsRouter);
app.use("/loggertest", loggertestRouter);

const server = app.listen(config.puerto, () => {
  logger.info(`Esta aplicación funciona en el puerto ${config.puerto}`);
});

const io = new SocketIOServer(server);

io.on("connection", (socket) => {
  logger.info("Nuevo usuario conectado");

  socket.on("message", async (data) => {
    await MessageModel.create(data);
    const messages = await MessageModel.find();
    io.sockets.emit("message", messages);
  });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de la Api",
      desription: "App dedicada a la administración de productos",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
