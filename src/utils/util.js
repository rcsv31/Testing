import passport from "passport";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        res
          .status(401)
          .send({ error: info.message ? info.message : info.toString() });
      } else {
        req.user = user;
        next();
      }
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send({ message: "Acceso denegado" });
    }
    next();
  };
};
