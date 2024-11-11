// config/blobStorage.js
const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(
    'La cadena de conexión de Azure Storage no está configurada.',
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING,
);
const containerClient = blobServiceClient.getContainerClient(
  'imagenes-artesanias',
);

if (!containerClient) {
  throw new Error(
    'Error al obtener el contenedor. Verifica el nombre del contenedor y la cadena de conexión.',
  );
}

module.exports = {
  containerClient,
};
