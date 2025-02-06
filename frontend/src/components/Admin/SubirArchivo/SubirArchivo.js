// src/components/SubirArchivo/SubirArchivo.jsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../../hooks";
import { Segment, Header, Icon, Button, Message } from "semantic-ui-react";
import "./SubirArchivo.scss";

/**
 * Componente SubirArchivo (genérico):
 * - title: Título (ej: "Agregar Categorías" o "Agregar Productos")
 * - onSubmit: (token, jsonData) => Promise
 *   Llamado al pulsar "Subir Archivo" con el JSON parseado completo
 * - onDownloadTemplate: () => Promise (descarga la plantilla, si existe)
 */
export function SubirArchivo({
  title = "Subir Archivo",
  onSubmit = async () => {},
  onDownloadTemplate = null,
}) {
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Hook de autenticación (para obtener el token, si hace falta)
  const { auth } = useAuth();

  // Manejador de arrastrar/soltar
  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    setSuccessMsg(null);

    if (!acceptedFiles || acceptedFiles.length === 0) {
      setSelectedFile(null);
      setError("No se ha seleccionado ningún archivo.");
      return;
    }

    // Guardamos solo el primer archivo
    setSelectedFile(acceptedFiles[0]);
  }, []);

  // Configurar dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Botón Subir Archivo: parsea JSON y llama onSubmit
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No has seleccionado ningún archivo.");
      return;
    }

    setError(null);
    setSuccessMsg(null);

    try {
      const fileText = await selectedFile.text();
      const jsonData = JSON.parse(fileText);

      // Llamar la función onSubmit con el token y el objeto JSON completo
      const response = await onSubmit(auth.token, jsonData);

      console.log("Respuesta onSubmit:", response);
      setSuccessMsg("¡Archivo procesado exitosamente!");
      setSelectedFile(null); // limpia el file (opcional)
    } catch (err) {
      console.error(err);
      setError(
        "Error al procesar el archivo. Asegúrate de que sea JSON válido."
      );
    }
  };

  // Botón Descargar Plantilla
  const handleDownload = async () => {
    setError(null);
    setSuccessMsg(null);
    if (!onDownloadTemplate) return;

    try {
      await onDownloadTemplate();
      setSuccessMsg("Plantilla descargada correctamente.");
    } catch (err) {
      setError("Error al descargar la plantilla.");
    }
  };

  return (
    <Segment placeholder className="subir-archivo">
      <Header as="h2" icon textAlign="center">
        <Icon name="file alternate outline" />
        {title}
      </Header>

      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}

      {successMsg && (
        <Message positive>
          <Message.Header>Éxito</Message.Header>
          <p>{successMsg}</p>
        </Message>
      )}

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
        style={{
          border: "2px dashed #ccc",
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        <input {...getInputProps()} accept="application/json" />
        {isDragActive ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <p>
            Arrastra y suelta tu archivo JSON aquí, o haz clic para seleccionar
          </p>
        )}
      </div>

      {selectedFile && (
        <Message info>
          Archivo seleccionado: <strong>{selectedFile.name}</strong>
        </Message>
      )}

      {/* Sección de botones */}
      <div
        style={{
          display: "flex",
          justifyContent: onDownloadTemplate ? "space-between" : "flex-end",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        {onDownloadTemplate && (
          <Button
            icon="download"
            content="Descargar Plantilla"
            onClick={handleDownload}
          />
        )}

        <Button
          primary
          icon="upload"
          content="Subir Archivo"
          onClick={handleUpload}
          disabled={!selectedFile}
        />
      </div>
    </Segment>
  );
}
