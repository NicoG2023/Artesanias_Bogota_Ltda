// grpcServer.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Op } = require("sequelize");
const { Usuario } = require("./models");

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

function main() {
  const server = new grpc.Server();
  // Registramos ambos métodos en el servicio
  server.addService(usersProto.UserService.service, {
    GetUsersByIds,
    SearchUsers, // <-- método nuevo
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
