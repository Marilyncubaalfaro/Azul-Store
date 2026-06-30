import React from "react";
import StaticPage from "../../components/StaticPage";

export default function ReclamacionesPage() {
  return (
    <StaticPage
      eyebrow="Libro de reclamaciones"
      title="Libro de reclamaciones"
      description="Canal formal para registrar reclamos o quejas sobre una compra, una entrega o el servicio recibido."
      sections={[
        {
          title: "Qué incluir",
          content: [
            "Número de pedido.",
            "Fecha de compra y datos de contacto.",
            "Descripción clara de lo ocurrido.",
          ],
        },
        {
          title: "Seguimiento",
          content:
            "Nuestro equipo revisará el caso y responderá por los canales de contacto registrados.",
        },
      ]}
      cta={{
        text: "Si necesitas ayuda inmediata, primero revisa el área de contacto.",
        label: "Ir a contacto",
        to: "/contacto",
      }}
    />
  );
}
