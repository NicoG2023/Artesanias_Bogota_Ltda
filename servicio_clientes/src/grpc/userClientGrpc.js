// userClientGrpc.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Ruta hacia el archivo users.proto
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
const userServiceClient = new usersProto.UserService(
  "users-service:50051", // Ajusta la IP/puerto según tu configuración
  grpc.credentials.createInsecure()
);

/**
 * Función para obtener múltiples usuarios por IDs vía gRPC
 * @param {number[]} userIds - array de IDs
 * @returns {Promise<Array<{ id, nombre, apellido, email, direcciones }>>}
 */
function getUsersByIds(userIds) {
  return new Promise((resolve, reject) => {
    userServiceClient.GetUsersByIds({ user_ids: userIds }, (err, response) => {
      if (err) return reject(err);
      // response.users es un array de { id, nombre, apellido, email, direcciones }
      resolve(response.users);
    });
  });
}

/**
 * Función para buscar usuarios por término vía gRPC
 * @param {string} searchTerm
 * @returns {Promise<Array<{ id, nombre, apellido, email, direcciones }>>}
 */
function searchUsersByTerm(searchTerm) {
  return new Promise((resolve, reject) => {
    userServiceClient.SearchUsers({ searchTerm }, (err, response) => {
      if (err) return reject(err);
      resolve(response.users);
    });
  });
}

/**
 * Función para obtener una dirección por su ID vía gRPC
 * @param {number} id - ID de la dirección
 * @param {number} usuario_id - ID del usuario
 * @returns {Promise<{ id, direccion, ciudad, departamento, codigo_postal, pais, info_adicional }>}
 */
function getDireccionById(id, usuario_id) {
  return new Promise((resolve, reject) => {
    userServiceClient.GetDireccionById({ id, usuario_id }, (err, response) => {
      if (err) return reject(err);
      // response.direccion es un objeto con la información de la dirección
      resolve(response.direccion);
    });
  });
}

/**
 * Función para obtener una dirección por su ID vía gRPC
 * @param {string} email - email vinculado
 * @returns {Promise<{ id }>}
 */
function getUsuarioByEmail(email) {
  return new Promise((resolve, reject) => {
    userServiceClient.GetUsuarioByEmail({ email }, (err, response) => {
      if (err) return reject(err);
      // response.usuario es un objeto con la información del usuario
      resolve(response.usuario.id);
    });
  });
}

/**
 * Función para obtener usuarios por vendedor_fk vía gRPC
 * @param {number[]} vendedorFks - Array de IDs de vendedor
 * @returns {Promise<Array<{ id, nombre, apellido, email }>>}
 */
function getUsersByVendedorFk(vendedorFks) {
  return new Promise((resolve, reject) => {
    userServiceClient.GetUsersByVendedorFk(
      { vendedor_fks: vendedorFks },
      (err, response) => {
        if (err) return reject(err);
        resolve(response.users); // Devuelve un array con los usuarios
      }
    );
  });
}

module.exports = {
  getUsersByIds,
  searchUsersByTerm,
  getDireccionById,
  getUsuarioByEmail,
  getUsersByVendedorFk,
};
