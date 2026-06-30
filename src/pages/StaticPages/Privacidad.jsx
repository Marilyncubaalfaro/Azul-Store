import React from "react";
import StaticPage from "../../components/StaticPage";

export default function PrivacidadPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Políticas de privacidad"
      description="Te contamos cómo tratamos tus datos cuando usas el sitio, creas una cuenta o realizas un pedido."
      sections={[
        {
          title: "Datos que usamos",
          content: [
            "Información de cuenta y contacto.",
            "Datos necesarios para procesar pedidos y envíos.",
            "Información técnica básica para mejorar la experiencia.",
          ],
        },
        {
          title: "Protección",
          content:
            "Mantenemos controles de acceso y buenas prácticas para resguardar la información del usuario.",
        },
      ]}
    />
  );
}