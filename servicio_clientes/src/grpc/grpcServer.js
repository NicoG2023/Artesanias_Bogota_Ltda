const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { PuntoVenta } = require("../models"); // tu modelo sequelize en microservicio clientes

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

/**
 * Implementación gRPC: GetPuntosVentaByIds
 */
async function GetPuntosVentaByIds(call, callback) {
  try {
    const ids = call.request.ids || [];
    const puntos = await PuntoVenta.findAll({
      where: { id: ids },
      // attributes: ["id", "nombre", "tipo", "direccion"]  // si quieres
    });

    // Convertir a la estructura de tu proto
    const puntos_venta = puntos.map((pv) => ({
      id: pv.id,
      nombre: pv.nombre,
      tipo: pv.tipo,
      direccion: pv.direccion,
    }));

    callback(null, { puntos_venta });
  } catch (error) {
    console.error("Error en GetPuntosVentaByIds:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al obtener puntos de venta",
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(puntosVentaProto.PuntoVentaService.service, {
    GetPuntosVentaByIds,
  });

  const address = "0.0.0.0:50053";
  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Error gRPC puntosVenta:", err);
        return;
      }
      console.log(`Servidor gRPC de PuntosVenta escuchando en ${address}`);
      server.start();
    }
  );
}

main();
