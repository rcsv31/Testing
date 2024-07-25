import winston from "winston";

const niveles = {
  nivel: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colores: {
    fatal: "red",
    error: "yellow",
    warning: "cyan",
    info: "green",
    http: "magenta",
    debug: "white",
  },
};

const logger = winston.createLogger({
  levels: niveles.nivel,
  transports: [
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "./errors.log",
            level: "info",
            format: winston.format.simple(),
          }),
        ]
      : [
          new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
          }),
        ]),
  ],
});

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

export { addLogger, logger };
