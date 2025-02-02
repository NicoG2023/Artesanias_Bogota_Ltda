const redisClient = require("../config/redisClient");
const { containerClient } = require("../config/blob-storage");
const {
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

// Cargar las credenciales desde el archivo .env
const accountName = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;

if (!accountName || !accountKey) {
  throw new Error(
    "Faltan AZURE_ACCOUNT_NAME o AZURE_ACCOUNT_KEY en el archivo .env"
  );
}

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const generarURLFirmada = (blobName, permisos, expiracionEnHoras = 5) => {
  try {
    const sasOptions = {
      containerName: containerClient.containerName,
      blobName,
      permissions: permisos,
      expiresOn: new Date(new Date().valueOf() + 3600 * 5000), //Expira en 5 horas
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();
    return `https://${accountName}.blob.core.windows.net/${containerClient.containerName}/${blobName}?${sasToken}`;
  } catch (error) {
    console.error("Error al generar URL firmada:", error.message);
    return null;
  }
};

/**
 * Obtiene la URL firmada para un blob (imagen) usando cache en Redis.
 * @param {string} blobName - El nombre del blob (archivo) en Azure.
 * @param {string} permisos - Los permisos para la URL firmada (por ejemplo, "r").
 * @returns {Promise<string>} La URL firmada.
 */
async function getSignedUrl(blobName, permisos) {
  const cacheKey = `signedUrl:${blobName}`;

  // Intenta obtener la URL del cache
  let cachedUrl = await redisClient.get(cacheKey);
  if (cachedUrl) {
    // Si ya está en cache, la retornamos
    return cachedUrl;
  }

  // Si no está en cache, generamos la URL firmada
  const newUrl = generarURLFirmada(blobName, permisos); // Función que ya tienes implementada
  if (newUrl) {
    // Almacenamos en Redis con un TTL (por ejemplo, 4 horas = 14400 segundos)
    await redisClient.setEx(cacheKey, 14400, newUrl);
  }
  return newUrl;
}

module.exports = { getSignedUrl };
