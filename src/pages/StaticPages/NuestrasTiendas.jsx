import React from "react";
import StaticPage from "../../components/StaticPage";

export default function NuestrasTiendasPage() {
  return (
    <StaticPage
      eyebrow="Azul Store"
      title="Nuestras tiendas"
      description="Encuentra nuestras concept stores en Lima para conocer las colecciones en un entorno más cercano."
      sections={[
        {
          title: "Miraflores",
          content:
            "Av. Jose Larco 812, Miraflores. Lunes a sábado de 10 a.m. a 7 p.m.",
        },
        {
          title: "San Isidro",
          content:
            "Av. Conquistadores 456, San Isidro. Lunes a sábado de 10 a.m. a 10 p.m.",
        },
      ]}
      cta={{
        text: "¿Quieres escribirnos antes de visitarnos?",
        label: "Ir a contacto",
        to: "/contacto",
      }}
    />
  );
}