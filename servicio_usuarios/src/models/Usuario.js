const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Añade índice único en email
      validate: {
        isEmail: true, // Valida formato de email
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100], // Contraseña con mínimo 8 caracteres
      },
    },
    puntos_descuento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    rol: {
      type: DataTypes.ENUM("cliente", "admin", "staff", "superadmin"),
      allowNull: false,
      defaultValue: "cliente",
    },
    es_activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    esta_verificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
    hooks: {
      // Función para manejar encriptación de contraseñas en un solo lugar
      beforeSave: async (usuario) => {
        if (usuario.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  }
);

module.exports = Usuario;
