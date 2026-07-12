import React from "react";
import StaticPage from "../../components/StaticPage";

export default function TerminosPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Términos y condiciones"
      description="Aquí se describen las reglas básicas de uso del sitio, compra y relación comercial con Azul Store."
      sections={[
        {
          title: "Uso del sitio",
          content: [
            "El acceso al sitio implica la aceptación de estas condiciones.",
            "La información publicada puede actualizarse sin aviso previo.",
          ],
        },
        {
          title: "Compras",
          content: [
            "Las compras están sujetas a validación de stock y confirmación de pago.",
            "Los precios y promociones pueden cambiar según disponibilidad.",
          ],
        },
      ]}
    />
  );
}