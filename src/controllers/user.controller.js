import passport from "passport";
import errorMessages from "../services/errors/custom-error.js";
import { UserDTO } from "../dto/user.dto.js";
import userRepository from "../repositories/user.repository.js";
import UserModel from "../models/user.model.js";
import EmailManager from "../services/email.js";
import { createHash, isValidPassword } from "../utils/hashbcryp.js";
import generarResetToken from "../utils/tokenreset.js";

const handlePassportAuth = async (
  strategy,
  successRedirect,
  failureRedirect,
  errorMessageMapper
) => {
  return async (req, res, next) => {
    try {
      const user = await passport.authenticate(strategy, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          const errorMessage = errorMessageMapper(info) || "Error desconocido.";
          return res.status(400).json({ error: errorMessage });
        }
        return user;
      })(req, res, next);
      res.redirect(successRedirect);
    } catch (error) {
      next(error);
    }
  };
};

export const register = await handlePassportAuth(
  "register",
  "/login",
  "/register",
  (info) => errorMessages.userErrors[info.errorCode]
);

export const login = await handlePassportAuth(
  "login",
  "/products",
  "/login",
  (info) => errorMessages.userErrors[info.errorCode]
);

export const githubCallback = await handlePassportAuth(
  "github",
  "/products",
  "/login",
  (info) => errorMessages.userErrors[info.errorCode]
);

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};

export const getCurrentUser = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "No autorizado" });
  }
  const userDTO = new UserDTO(req.user);
  res.json(userDTO);
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send("Usuario no encontrado");

    const token = generarResetToken();
    user.resetToken = {
      token,
      expire: new Date(Date.now() + 3600000), // 1 Hora de duración
    };
    await user.save();

    await EmailManager.enviarCorreoRestablecimiento(
      email,
      user.first_name,
      token
    );
    res.redirect("/confirmacion-envio");
  } catch (error) {
    console.error(
      "Error al solicitar el restablecimiento de contraseña:",
      error
    );
    res.status(500).send("Error interno del servidor");
  }
};

export const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.render("passwordcambio", { error: "Usuario no encontrado" });

    const resetToken = user.resetToken;
    if (
      !resetToken ||
      resetToken.token !== token ||
      new Date() > resetToken.expire
    ) {
      return res.render("passwordreset", {
        error: "El token es inválido o ha expirado",
      });
    }

    if (isValidPassword(password, user)) {
      return res.render("passwordcambio", {
        error: "La nueva contraseña no puede ser igual a la anterior",
      });
    }

    user.password = createHash(password);
    user.resetToken = undefined;
    await user.save();

    res.redirect("/login");
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res
      .status(500)
      .render("passwordreset", { error: "Error interno del servidor" });
  }
};

export const cambiarRolPremium = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await UserModel.findById(uid);
    if (!user) return res.status(404).send("Usuario no encontrado");

    user.role = user.role === "usuario" ? "premium" : "usuario";
    const actualizado = await UserModel.findByIdAndUpdate(
      uid,
      { role: user.role },
      { new: true }
    );

    res.json(actualizado);
  } catch (error) {
    console.error("Error al cambiar el rol del usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};
