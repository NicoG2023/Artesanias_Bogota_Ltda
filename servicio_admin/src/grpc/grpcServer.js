// grpcServer.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Producto } = require("../models"); // tu modelo sequelize

const PROTO_PATH = path.join(__dirname, "proto", "products.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productsProto = grpc.loadPackageDefinition(packageDefinition).products;

/**
 * Implementación gRPC: GetProductsByIds
 */
async function GetProductsByIds(call, callback) {
  try {
    const productIds = call.request.product_ids || [];
    // Consulta en la base de datos
    const productos = await Producto.findAll({
      attributes: ["id", "nombre", "imagen", "precio"],
      where: { id: productIds },
    });

    // Convertir a la estructura que definiste en products.proto
    const products = productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      imagen: p.imagen,
      precio: p.precio,
    }));

    callback(null, { products });
  } catch (error) {
    console.error("Error en GetProductsByIds gRPC:", error);
    return callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al obtener productos",
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(productsProto.ProductService.service, { GetProductsByIds });

  // Ejemplo: escuchar en 0.0.0.0:50052
  const address = "0.0.0.0:50052";
  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Error gRPC:", err);
        return;
      }
      console.log(`Servidor gRPC de Productos escuchando en ${address}`);
      server.start();
    }
  );
}

main();
