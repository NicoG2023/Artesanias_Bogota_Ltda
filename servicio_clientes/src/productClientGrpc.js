// productClientGrpc.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.join(__dirname, "proto", "products.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productsProto = grpc.loadPackageDefinition(packageDefinition).products;

// Nombre del servicio (p.ej. "admins-service") y puerto (50052) en Docker Compose
const productServiceClient = new productsProto.ProductService(
  "admins-service:50052",
  grpc.credentials.createInsecure()
);

function getProductsByIds(productIds) {
  return new Promise((resolve, reject) => {
    productServiceClient.GetProductsByIds(
      { product_ids: productIds },
      (err, response) => {
        if (err) return reject(err);
        // response.products es array de { id, nombre, imagen, precio }
        resolve(response.products);
      }
    );
  });
}

module.exports = {
  getProductsByIds,
};
