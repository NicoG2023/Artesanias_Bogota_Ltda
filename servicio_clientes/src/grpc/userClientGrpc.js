// userClientGrpc.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Ruta hacia el mismo users.proto que definiste en el microservicio de Usuarios.
// Puedes copiarlo/localmente o tenerlo referenciado
const PROTO_PATH = path.join(__dirname, "proto", "users.proto");

// Cargar la definición
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const usersProto = grpc.loadPackageDefinition(packageDefinition).users;

// Crear un cliente gRPC que apunte al host:puerto del microservicio de Usuarios
// donde corre tu grpcServer (p.ej. "0.0.0.0:50051")
const userServiceClient = new usersProto.UserService(
  "users-service:50051", // Ajusta la IP/puerto
  grpc.credentials.createInsecure()
);

/**
 * Función para obtener múltiples usuarios por IDs vía gRPC
 * @param {number[]} userIds - array de IDs
 * @returns {Promise<Array<{ id, nombre, apellido, email }>>}
 */
function getUsersByIds(userIds) {
  return new Promise((resolve, reject) => {
    userServiceClient.GetUsersByIds({ user_ids: userIds }, (err, response) => {
      if (err) {
        return reject(err);
      }
      // 'response.users' es un array de { id, nombre, apellido, email }
      resolve(response.users);
    });
  });
}

// Buscador de usuarios por termino
function searchUsersByTerm(searchTerm) {
  return new Promise((resolve, reject) => {
    userServiceClient.SearchUsers({ searchTerm }, (err, response) => {
      if (err) return reject(err);
      // response.users => array de { id, nombre, apellido, email }
      resolve(response.users);
    });
  });
}

module.exports = {
  getUsersByIds,
  searchUsersByTerm,
};
