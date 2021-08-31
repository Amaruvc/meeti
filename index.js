const express = require("express");
const router = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const expressValidator = require("express-validator");
const passport = require("./config/passport");

//Configuración y modelos
const db = require("./config/db");
require("./models/Usuarios");
db.sync()
  .then(() => console.log("BD Conectada"))
  .catch((error) => {
    console.log(error);
  });

//Variables de desarrollo
require("dotenv").config({ path: "variables.env" });

//Aplicación principal
const app = express();

//BodyParser, leer formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Express validator (validación con varias funciones)
app.use(expressValidator());

//Habilitar EJS como template engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//Ubicacion de vistas
app.set("views", path.join(__dirname, "./views"));

//Archivos estáticos
app.use(express.static("public"));

//Habilitar cookieparser
app.use(cookieParser());

//Crear la sesion
app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

//iniciarlizar passport
app.use(passport.initialize());
app.use(passport.session());

//Agrega flash messages
app.use(flash());

//middleware propio (usuario logueado, flash messages, fecha actual)
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

//routing
app.use("/", router());

//Agrega el puerto
app.listen(process.env.PORT, () => {
  console.log("El servidor está funcionando");
});
