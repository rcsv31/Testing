import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import LocalStrategy from "passport-local";
import GitHubStrategy from "passport-github";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import cartService from "../services/cart.service.js";

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

const initializePassport = async () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, {
              message: "El correo electrónico ya está registrado",
            });
          }

          const newCart = await cartService.createNewCart();
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
          };

          const savedUser = await userModel.create(newUser);
          return done(null, savedUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          if (!isValidPassword(password, user)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email || `${profile.username}@github.com`;
          const user = await UserModel.findOne({ email });
          if (!user) {
            const newCart = await cartService.createNewCart();
            const newUser = {
              first_name: profile._json.name || profile.username,
              last_name: profile._json.name || profile.username,
              email,
              age: 18,
              cart: newCart._id,
              password: createHash("github"),
            };
            const savedUser = await userModel.create(newUser);
            return done(null, savedUser);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
