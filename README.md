# Azul Store Frontend

Aplicación web de e-commerce construida con React + Vite.

## Qué incluye

- Catálogo por categorías y subcategorías (sección Explora)
- Detalle de producto con galería (hasta 5 imágenes)
- Carrito con variantes por talla y control de stock
- Login, registro público y perfil de usuario
- Checkout conectado a API
- Panel admin (ruta /admin) para gestión de productos y usuarios

## Requisitos

- Node.js 20+
- npm 10+
- API levantada en local

## Variables de entorno

Crea archivo .env en esta carpeta con la URL de la API:

VITE_API_URL=http://localhost:3000

Esta variable es obligatoria.

## Instalación

cd /Users/haroldnc/Documents/Code/Tareas/azul-store
npm install

## Desarrollo

cd /Users/haroldnc/Documents/Code/Tareas/azul-store
npm run dev

Servidor por defecto: http://localhost:5173

## Build

cd /Users/haroldnc/Documents/Code/Tareas/azul-store
npm run build

## Scripts disponibles

- npm run dev
- npm run build
- npm run preview
- npm run lint

## Flujo de autenticación

- Login en /login
- Registro público en /register (rol básico user)
- Perfil en /account
- Admin en /admin (solo rol admin)

## Estructura principal

- src/pages: pantallas (Home, Shop, ProductDetail, Cart, Account, Login, Register, Admin)
- src/components: componentes reutilizables
- src/context: estado global (AuthContext, CartContext)
- src/utils: utilidades de API y formato de precios
