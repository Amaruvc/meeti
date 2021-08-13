const Sequelize = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt-nodejs");

const Usuarios = db.define(
  "usuarios",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: Sequelize.STRING(60),
    },
    imagen: {
      type: Sequelize.STRING(60),
    },
    email: {
      type: Sequelize.STRING(30),
      allowNull: false,
      validate: {
        isEmail: { msg: "Agrega un correo válido" },
      },
      unique: {
        args: true,
        msg: "Usuario ya registrado",
      },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debes ingresar una contraseña",
        },
      },
    },
    activo: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    tokenPassword: {
      type: Sequelize.STRING,
    },
    expiraToken: {
      type: Sequelize.DATE,
    },
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(12),
          null
        );
      },
    },
  }
);

//Método para comparar password
Usuarios.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = Usuarios;
