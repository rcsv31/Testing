import express from "express";
import passport from "passport";

const router = express.Router();

// Ruta para autenticación con GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback de GitHub después de la autenticación
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/products",
    failureRedirect: "/login",
  })
);

// Ruta current (obtiene el usuario actual)
router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("profile", { user: req.user });
  } else {
    res.status(401).json({ message: "Usuario no autenticado" });
  }
});

// Ruta logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

export default router;
