import session from "express-session";
import MongoStore from "connect-mongo";

const sessionMiddleware = (mongoUrl, sessionSecret, isProduction) => {
  // Configuración de la tienda de sesiones
  const sessionStore = MongoStore.create({
    mongoUrl,
    collectionName: "sessions",
    ttl: 1 * 24 * 60 * 60, // Tiempo de vida de la sesión en segundos (1 día)
    autoRemove: "native", // Limpieza automática de sesiones expiradas
  });

  // Middleware de sesión
  return session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: isProduction, // Asegura las cookies en producción (HTTPS)
      maxAge: 1 * 24 * 60 * 60 * 1000, // Tiempo de vida de la cookie en milisegundos (1 día)
    },
  });
};

export default sessionMiddleware;
