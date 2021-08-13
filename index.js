const express = require("express");
const router = require("./routes");
const db = require("./config/db");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("BD Conectada"))
  .catch((error) => {
    console.log(error);
  });

require("dotenv").config({ path: "variables.env" });

const app = express();

//Habilitar EJS como template engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//Ubicacion de vistas
app.set("views", path.join(__dirname, "./views"));

//Archivos estáticos
app.use(express.static("public"));

//middleware propio (usuarui logueado, flash messages, fecha actual)
app.use((req, res, next) => {
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
