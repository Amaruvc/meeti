const express = require("express");
const router = require("./routes");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config({ path: "variables.env" });

const app = express();

//Habilitar EJS como template engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//Ubicacion de vistas
app.set("views", path.join(__dirname, "./views"));

//Archivos estáticos
app.use(express.static("public"));

//routing
app.use("/", router());

//Agrega el puerto
app.listen(process.env.PORT, () => {
  console.log("El servidor está funcionando");
});
