const passport = require("passport");
const LocalStategy = require("passport-local").Strategy;
const Usuarios = require("../models/Usuarios");

passport.use(
  new LocalStategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, next) => {
      //Código se ejecuta al llenar el formulario
      const usuario = await Usuarios.findOne({
        where: { email: email, activo: 1 },
      });

      //Revisar si existe o no
      if (!usuario) {
        return next(null, false, {
          message: "El usuario no existe o no has validado la cuenta",
        });
      }
      //El usuario existe, comparar su password

      const verificarPass = usuario.validarPassword(password);

      //Si el password es incorrecto
      if (!verificarPass) {
        return next(null, false, {
          message: "Password incorrecto",
        });
      }

      //Todo bien
      return next(null, usuario);
    }
  )
);

passport.serializeUser(function (usuario, cb) {
  cb(null, usuario);
});

passport.deserializeUser(function (usuario, cb) {
  cb(null, usuario);
});

module.exports = passport;
