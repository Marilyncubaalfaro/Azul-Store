import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import CheckoutStatus from "./pages/CheckoutStatus";
import {
  AccesoriosPage,
  ContactoPage,
  EnvioPage,
  NuestrasTiendasPage,
  PrivacidadPage,
  ReclamacionesPage,
  SobreNosotrosPage,
  TerminosPage,
} from "./pages/StaticPages";
import RequireAuth from "./components/AuthGuard";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout/success"
          element={<CheckoutStatus type="success" />}
        />
        <Route
          path="/checkout/pending"
          element={<CheckoutStatus type="pending" />}
        />
        <Route
          path="/checkout/failure"
          element={<CheckoutStatus type="failure" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sobre-nosotros" element={<SobreNosotrosPage />} />
        <Route path="/nuestras-tiendas" element={<NuestrasTiendasPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/terminos" element={<TerminosPage />} />
        <Route path="/privacidad" element={<PrivacidadPage />} />
        <Route path="/envio" element={<EnvioPage />} />
        <Route path="/reclamaciones" element={<ReclamacionesPage />} />
        <Route path="/accesorios" element={<AccesoriosPage />} />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <Admin />
            </RequireAuth>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
