import React from "react";
import StaticPage from "../../components/StaticPage";

export default function ContactoPage() {
  return (
    <StaticPage
      eyebrow="Atención al cliente"
      title="Contacto"
      description="Si necesitas ayuda con tu pedido, tus datos o una consulta general, estos son nuestros canales de contacto."
      sections={[
        {
          title: "Canales de atención",
          content: [
            "Correo: soporte@azulstore.com",
            "Horario: lunes a sábado, 10 a.m. a 7 p.m.",
            "Respuesta prioritaria para consultas de pedidos y envíos.",
          ],
        },
        {
          title: "Antes de escribir",
          content:
            "Ten a la mano tu número de pedido, correo registrado y cualquier detalle relevante para agilizar la respuesta.",
        },
      ]}
      cta={{
        text: "¿Necesitas revisar tu cuenta primero?",
        label: "Mi cuenta",
        to: "/account",
      }}
    />
  );
}