const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { PuntoVenta, Orden, Pago, REL_Orden_Producto } = require("../models");
const { Op } = require("sequelize");

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

async function GetOrdenesByUserId(call, callback) {
  try {
    const { usuario_id } = call.request;
    if (!usuario_id) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "Usuario ID es requerido",
      });
    }

    // 🔹 1️⃣ Obtener las órdenes pagadas del usuario
    const ordenes = await Orden.findAll({
      attributes: ["id"],
      where: { usuario_fk: usuario_id },
      include: [
        {
          model: Pago,
          as: "pago",
          attributes: ["estado"],
          where: { estado: "paid" }, // Solo órdenes pagadas
        },
      ],
      raw: true,
    });

    if (ordenes.length === 0) {
      return callback(null, { productos_ids: [] });
    }

    const ordenIds = ordenes.map((o) => o.id);

    // 🔹 2️⃣ Obtener los productos de esas órdenes
    const productosComprados = await REL_Orden_Producto.findAll({
      attributes: ["producto_fk"],
      where: { orden_fk: { [Op.in]: ordenIds } },
      raw: true,
    });

    const productosIds = [
      ...new Set(productosComprados.map((p) => p.producto_fk)),
    ]; // Eliminar repetidos

    return callback(null, { productos_ids: productosIds });
  } catch (error) {
    console.error("Error en GetOrdenesByUserId gRPC:", error);
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al obtener productos comprados",
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(puntosVentaProto.PuntoVentaService.service, {
    GetPuntosVentaByIds,
    GetOrdenesByUserId,
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
