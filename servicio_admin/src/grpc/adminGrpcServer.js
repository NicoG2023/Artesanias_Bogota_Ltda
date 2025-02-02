// admin/grpc/adminGrpcServer.js
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const { Inventario, Producto } = require("../models"); // Modelos Sequelize en Admin

const PROTO_PATH = path.join(__dirname, "proto", "admin.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const adminProto = grpc.loadPackageDefinition(packageDefinition).admin;

// Implementación del método gRPC
async function DeleteInventariosAndProductsByPuntoVentaId(call, callback) {
  try {
    const { punto_venta_id } = call.request;

    // 1. Obtén todos los inventarios del punto de venta
    const inventarios = await Inventario.findAll({
      where: { punto_venta_fk: punto_venta_id },
    });

    // 2. Recopila los IDs de producto que había en esos inventarios
    const productIds = [...new Set(inventarios.map((inv) => inv.producto_fk))];

    // 3. Elimina los inventarios para ese punto de venta
    await Inventario.destroy({ where: { punto_venta_fk: punto_venta_id } });

    // 4. Verifica para cada producto si sigue existiendo en otros inventarios
    for (const productId of productIds) {
      const count = await Inventario.count({
        where: { producto_fk: productId },
      });
      // Si ese producto ya no existe en ningún otro inventario, lo eliminamos
      if (count === 0) {
        await Producto.destroy({ where: { id: productId } });
      }
    }

    // Respuesta de éxito al cliente gRPC
    callback(null, {
      message: `Inventarios (y algunos productos) eliminados para el punto de venta ${punto_venta_id}`,
    });
  } catch (error) {
    console.error(
      "Error en DeleteInventariosAndProductsByPuntoVentaId:",
      error
    );
    callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Error al eliminar inventarios/productos.",
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(adminProto.AdminService.service, {
    DeleteInventariosAndProductsByPuntoVentaId,
  });

  const address = "0.0.0.0:50054"; // Puerto en el que expone gRPC el microservicio Admin
  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Error al iniciar servidor gRPC de Admin:", err);
        return;
      }
      console.log(`Servidor gRPC Admin escuchando en ${address}`);
      server.start();
    }
  );
}

main();
