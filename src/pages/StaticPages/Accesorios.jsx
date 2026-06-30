import React from "react";
import StaticPage from "../../components/StaticPage";

export default function AccesoriosPage() {
  return (
    <StaticPage
      eyebrow="Colección"
      title="Accesorios"
      description="Próximamente encontrarás aquí la curaduría de accesorios para complementar tus looks."
      sections={[
        {
          title: "Estado actual",
          content:
            "La sección todavía está en preparación. Mientras tanto puedes explorar nuestras colecciones activas.",
        },
        {
          title: "Recomendación",
          content: [
            "Visita Ropa para ver las piezas principales.",
            "Revisa Beachwear y Nightwear para otros momentos de uso.",
          ],
        },
      ]}
      cta={{
        text: "Explora las categorías disponibles mientras terminamos esta colección.",
        label: "Ver ropa",
        to: "/shop/ropa",
      }}
    />
  );
}
