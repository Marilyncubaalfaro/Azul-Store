import React from "react";
import StaticPage from "../../components/StaticPage";

export default function EnvioPage() {
  return (
    <StaticPage
      eyebrow="Logística"
      title="Políticas de envío"
      description="Resumen general de cómo gestionamos preparación, despacho y entrega de tus pedidos."
      sections={[
        {
          title: "Preparación",
          content:
            "Procesamos los pedidos una vez confirmado el pago y la disponibilidad de stock.",
        },
        {
          title: "Cobertura",
          content: [
            "Envíos disponibles a nivel nacional según cobertura logística.",
            "Los tiempos de entrega dependen de la ubicación y el operador.",
          ],
        },
      ]}
    />
  );
}
