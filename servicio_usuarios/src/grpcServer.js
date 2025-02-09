// grpcServer.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Op } = require("sequelize");
const { Usuario, Direccion } = require("./models");

const PROTO_PATH = path.join(__dirname, "proto", "users.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const usersProto = grpc.loadPackageDefinition(packageDefinition).users;

// Método existente
async function GetUsersByIds(call, callback) {
  try {
    const userIds = call.request.user_ids || [];
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "apellido", "email"],
      where: { id: userIds },
    });

    const users = usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
    }));

    callback(null, { users });
  } catch (error) {
    console.error("Error en GetUsersByIds gRPC:", error);
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al obtener usuarios",
    });
  }
}

async function GetUsuarioByEmail(call, callback) {
  try {
    const email = call.request.email;
    const usuario = await Usuario.findOne({
      where: { email },
    });
    if (!usuario) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Usuario no encontrado",
      });
    }
    callback(null, { usuario: usuario.toJSON() });
  } catch (error) {
    console.error("Error en GetUsuarioByEmail gRPC:", error);
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al obtener usuario",
    });
  }
}

// NUEVO: Buscar usuarios por termino (nombre, apellido, email)
async function SearchUsers(call, callback) {
  try {
    const searchTerm = call.request.searchTerm || "";
    if (!searchTerm) {
      // Si no hay término, retornamos vacío
      return callback(null, { users: [] });
    }

    // Busca usuarios que cumplan con el "searchTerm" en nombre, apellido o email
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "apellido", "email"],
      where: {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${searchTerm}%` } },
          { apellido: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      },
    });

    const users = usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
    }));

    return callback(null, { users });
  } catch (error) {
    console.error("Error en SearchUsers gRPC:", error);
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al buscar usuarios",
    });
  }
}

async function GetDireccionById(call, callback) {
  try {
    const { id, usuario_id } = call.request;
    // Buscar la dirección y verificar que pertenezca al usuario
    const direccion = await Direccion.findOne({
      where: {
        id,
        usuario_fk: usuario_id,
      },
    });
    if (!direccion) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Dirección no encontrada o no pertenece al usuario",
      });
    }
    callback(null, { direccion: direccion.toJSON() });
  } catch (error) {
    console.error("Error en GetDireccionById gRPC:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al obtener la dirección",
    });
  }
}

async function GetUsersByVendedorFk(call, callback) {
  try {
    const vendedorFks = call.request.vendedor_fks || [];

    if (vendedorFks.length === 0) {
      return callback(null, { users: [] });
    }

    // Obtener usuarios con esos IDs
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "apellido", "email"],
      where: { id: { [Op.in]: vendedorFks } },
    });

    const users = usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
    }));

    callback(null, { users });
  } catch (error) {
    console.error("Error en GetUsersByVendedorFk gRPC:", error);
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al obtener usuarios",
    });
  }
}

function main() {
  const server = new grpc.Server();
  // Registramos ambos métodos en el servicio
  server.addService(usersProto.UserService.service, {
    GetUsersByIds,
    SearchUsers,
    GetDireccionById,
    GetUsuarioByEmail,
    GetUsersByVendedorFk,
  });

  const address = "0.0.0.0:50051";
  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Error al iniciar el servidor gRPC:", err);
        return;
      }
      console.log(`Servidor gRPC escuchando en ${address}`);
      server.start();
    }
  );
}

main();
