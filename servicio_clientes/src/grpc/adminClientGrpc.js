// clientes/grpc/adminClientGrpc.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Cargamos el proto de Admin
const PROTO_PATH = path.join(__dirname, "proto", "admin.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const adminProto = grpc.loadPackageDefinition(packageDefinition).admin;

// Direccion del microservicio Admin en Docker (o donde sea)
const adminServiceClient = new adminProto.AdminService(
  "admin-service:50054", // Ajusta al nombre de tu contenedor/host y puerto
  grpc.credentials.createInsecure()
);

// Envolvemos la llamada gRPC en una Promesa
function deleteInventariosAndProductsByPuntoVentaId(punto_venta_id) {
  return new Promise((resolve, reject) => {
    adminServiceClient.DeleteInventariosAndProductsByPuntoVentaId(
      { punto_venta_id },
      (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      }
    );
  });
}

module.exports = {
  deleteInventariosAndProductsByPuntoVentaId,
};
