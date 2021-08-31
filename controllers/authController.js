const passport = require("passport");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/administracion",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

//Revisa si el usuario está autenticado
exports.usuarioAutenticado = (req, res, next) => {
  //Si el usuairo está autenticado
  if (req.isAuthenticated()) {
    return next();
  }

  //Si no está autenticado
  return failureRedirect("/iniciar-sesion");
};
