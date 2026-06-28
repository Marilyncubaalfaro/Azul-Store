import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAuthenticated, isCheckingSession } = useAuth();
  const isAdmin = user?.roles?.includes("admin");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <Link
          className="brand"
          to="/"
          aria-label="Azul Store inicio"
          onClick={closeMenu}
        >
          <span className="brand-mark">A</span>
          <span>
            <strong>AZUL</strong>
            <small>STORE</small>
          </span>
        </Link>

        <div className="header-actions">
          <Link
            className={`icon-button ${isAuthenticated ? "profile-active" : ""}`}
            to={isAuthenticated ? "/account" : "/login"}
            aria-label={
              isCheckingSession
                ? "Verificando sesion"
                : isAuthenticated
                  ? "Ir a mi perfil"
                  : "Iniciar sesion"
            }
            title={isAuthenticated ? "Mi perfil" : "Iniciar sesion"}
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 21a8 8 0 0 0-16 0"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
          <Link
            className="icon-button cart-button-container"
            to="/cart"
            aria-label="Carrito"
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 7h12l-1 14H7L6 7Z"></path>
              <path d="M9 7a3 3 0 0 1 6 0"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <nav className="main-nav" aria-label="Principal">
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          Menu
        </button>
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            Ofertas
          </NavLink>
          <NavLink
            to="/shop/ropa"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            Ropa
          </NavLink>
          <NavLink
            to="/shop/beachwear"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            Beachwear
          </NavLink>
          <NavLink
            to="/shop/nightwear"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            Nightwear
          </NavLink>
          <a href="/#brands" onClick={closeMenu}>
            Brands
          </a>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              Admin
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
