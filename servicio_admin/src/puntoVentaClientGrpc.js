// admin/grpc/puntoVentaClientGrpc.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Ajusta la ruta de tu proto
const PROTO_PATH = path.join(__dirname, "proto", "puntos_venta.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const puntosVentaProto =
  grpc.loadPackageDefinition(packageDefinition).puntosventa;

// Indica la dirección del contenedor "clientes-service:50053" (según tu docker-compose)
const puntoVentaServiceClient = new puntosVentaProto.PuntoVentaService(
  "clients-service:50053",
  grpc.credentials.createInsecure()
);

/**
 * Llama a GetPuntosVentaByIds con un array de IDs.
 * Retorna un array de { id, nombre, tipo, direccion }.
 */
function getPuntosVentaByIds(ids) {
  return new Promise((resolve, reject) => {
    puntoVentaServiceClient.GetPuntosVentaByIds({ ids }, (err, response) => {
      if (err) return reject(err);
      // response.puntos_venta es un array con { id, nombre, tipo, direccion }
      resolve(response.puntos_venta);
    });
  });
}

module.exports = {
  getPuntosVentaByIds,
};
