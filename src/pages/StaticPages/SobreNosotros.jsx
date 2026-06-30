import React from "react";
import StaticPage from "../../components/StaticPage";

export default function SobreNosotrosPage() {
  return (
    <StaticPage
      eyebrow="Azul Store"
      title="Sobre nosotros"
      description="Azul Store nace para ofrecer una experiencia de moda más clara, cuidada y fácil de recorrer, combinando selección curada y navegación simple."
      sections={[
        {
          title: "Nuestra propuesta",
          content:
            "Seleccionamos prendas y colecciones con una mirada editorial para que comprar sea más intuitivo y visualmente limpio.",
        },
        {
          title: "Nuestro enfoque",
          content: [
            "Curaduría de productos con foco en estilo y funcionalidad.",
            "Experiencia digital centrada en rapidez y claridad.",
            "Atención y soporte pensados para un ecommerce directo.",
          ],
        },
      ]}
      cta={{
        text: "Explora la colección principal o vuelve al inicio.",
        label: "Ir al inicio",
        to: "/",
      }}
    />
  );
}