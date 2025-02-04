// EnvioOrden.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Step, Icon } from "semantic-ui-react";
import { API_SERVICIO_CLIENTES } from "../../../../utils/constants";

const socket = io(API_SERVICIO_CLIENTES);

export function EnvioOrden({ ordenId, currentEstado }) {
  // Estado actual desde Socket (inicia con el valor prop)
  const [estado, setEstado] = useState(currentEstado || "CREADA");

  // Mapea estado -> índice (0 a 3) para el Step
  const estadoToStepIndex = (estado) => {
    switch (estado) {
      case "pendiente":
      case "CREADA":
      case "confirmada":
        return 0; // Orden Confirmada
      case "procesando":
        return 1; // Procesando
      case "EN_RUTA":
        return 2; // Despachado
      case "ENTREGADA":
        return 3; // Entregado
      default:
        return 0;
    }
  };

  const stepsConfig = [
    {
      key: "orden-confirmada",
      icon: "check circle",
      title: "Orden Confirmada",
      description: "Hemos recibido tu orden",
    },
    {
      key: "procesando",
      icon: "cog",
      title: "Procesando Orden",
      description: "Estamos preparando tu pedido",
    },
    {
      key: "despachado",
      icon: "truck",
      title: "Producto Despachado",
      description: "Tu producto está en camino",
    },
    {
      key: "entregado",
      icon: "home",
      title: "Producto Entregado",
      description: "Tu orden ha sido entregada",
    },
  ];

  const activeStep = estadoToStepIndex(estado);

  useEffect(() => {
    // Unirse a la sala de la orden
    socket.emit("joinOrderRoom", ordenId);

    // Escuchar el cambio de estado desde el backend
    socket.on("estadoActualizado", (data) => {
      if (data.ordenId === ordenId) {
        setEstado(data.nuevoEstado);
      }
    });

    // Cleanup al desmontar
    return () => {
      socket.off("estadoActualizado");
    };
  }, [ordenId]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <Step.Group
        widths={4} // Reparte en 4 columnas
        size="small" // Tamaño de los Steps
        // fluid            // <-- QUITAR fluid para no forzar ancho completo
        style={{ margin: "0 auto" }} // Centrar un poco si quieres
      >
        {stepsConfig.map((step, index) => {
          const completed = activeStep > index;
          const isActive = activeStep === index;

          return (
            <Step
              key={step.key}
              active={isActive}
              completed={completed}
              disabled={activeStep < index}
            >
              <Icon name={step.icon} />
              <Step.Content>
                <Step.Title>{step.title}</Step.Title>
                <Step.Description>{step.description}</Step.Description>
              </Step.Content>
            </Step>
          );
        })}
      </Step.Group>
    </div>
  );
}
