const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/emails");

exports.formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crea tu cuenta",
  });
};

exports.crearNuevaCuenta = async (req, res) => {
  const usuario = req.body;

  req
    .checkBody("confirmar", "La contraseña de formirmación no puede ir vacío")
    .notEmpty();
  req
    .checkBody("confirmar", "Las contraseñas no coincide")
    .equals(req.body.password);

  //Leer los errores de express
  const erroresExpress = req.validationErrors();

  try {
    await Usuarios.create(usuario);

    //Generar url de confirmación
    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

    //Enviar email de confirmación
    await enviarEmail.envirEmail({
      usuario,
      url,
      subject: "Confirma tu cuenta de meeti",
      archivo: "confirmar-cuenta",
    });

    //Flash message y redireccionar
    req.flash("exito", "Hemos enviado un e-mail, confirma tu cuenta");
    res.redirect("/iniciar-sesion");
  } catch (error) {
    if (error.errors) {
      //Extraer el message de los errores
      const erroresSequelize = error.errors.map((err) => err.message);

      //Extraer unicamente el msg de los errores
      const errExp = erroresExpress.map((err) => err.msg);

      //Unir los errores
      const listaErrores = [...erroresSequelize, ...errExp];

      req.flash("error", listaErrores);
    } else {
      console.log(error);
    }
    res.redirect("crear-cuenta");
  }
};

//Formulario para iniciar sesion
exports.formIniciarSesion = async (req, res) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Iniciar Sesión",
  });
};
