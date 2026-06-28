import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { requestJson } from "../../utils/api";
import "./Admin.css";

const emptyStockRows = () => [
  { size: "S", stock: 0 },
  { size: "M", stock: 0 },
  { size: "L", stock: 0 },
  { size: "XL", stock: 0 },
];

const emptyImageRows = () => [{ url: "" }];

const MAX_TOTAL_IMAGES = 5;
const MAX_EXTRA_IMAGES = MAX_TOTAL_IMAGES - 1;

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildImageRows(product) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const extraImages = images.filter((image) => image !== product?.image);

  if (extraImages.length === 0) {
    return emptyImageRows();
  }

  return extraImages.slice(0, MAX_EXTRA_IMAGES).map((url) => ({ url }));
}

function buildFormFromProduct(product, nextId) {
  if (!product) {
    return {
      id: nextId,
      brand: "",
      name: "",
      price: "",
      originalPrice: "",
      badge: "",
      image: "",
      imageRows: emptyImageRows(),
      subcategoriesText: "",
      category: "ropa",
      isOffer: false,
      stockRows: emptyStockRows(),
    };
  }

  return {
    id: product.id,
    brand: product.brand ?? "",
    name: product.name ?? "",
    price: product.price ?? "",
    originalPrice: product.originalPrice ?? "",
    badge: product.badge ?? "",
    image: product.image ?? "",
    imageRows: buildImageRows(product),
    subcategoriesText: Array.isArray(product.subcategories)
      ? product.subcategories.join("\n")
      : "",
    category: product.category ?? "ropa",
    isOffer: Boolean(product.isOffer),
    stockRows:
      Array.isArray(product.stockBySize) && product.stockBySize.length > 0
        ? product.stockBySize.map((entry) => ({
            size: String(entry.size).toUpperCase(),
            stock: Number(entry.stock) || 0,
          }))
        : emptyStockRows(),
  };
}

export default function Admin() {
  const { user, accessToken } = useAuth();
  const isAdmin = user?.roles?.includes("admin");

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [form, setForm] = useState(buildFormFromProduct(null, 1));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageWarning, setImageWarning] = useState("");
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [userRegisterError, setUserRegisterError] = useState("");
  const [userRegisterSuccess, setUserRegisterSuccess] = useState("");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    roles: {
      user: true,
      admin: false,
    },
  });

  const nextProductId = useMemo(() => {
    if (products.length === 0) {
      return 1;
    }

    return Math.max(...products.map((item) => Number(item.id) || 0)) + 1;
  }, [products]);

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  useEffect(() => {
    if (!isAdmin || !accessToken) {
      return;
    }

    let active = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await requestJson("/products");
        if (!active) {
          return;
        }

        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        setSelectedProductId((currentSelectedId) => {
          if (
            currentSelectedId &&
            list.some((item) => item.id === currentSelectedId)
          ) {
            return currentSelectedId;
          }

          return list[0]?.id ?? null;
        });
      } catch (requestError) {
        if (active) {
          setProducts([]);
          setError(requestError.message || "No se pudo cargar el catálogo.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [accessToken, isAdmin]);

  useEffect(() => {
    setForm(buildFormFromProduct(selectedProduct, nextProductId));
  }, [nextProductId, selectedProduct]);

  const handleFieldChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleStockRowChange = (index, field, value) => {
    setForm((current) => ({
      ...current,
      stockRows: current.stockRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const handleImageRowChange = (index, value) => {
    setForm((current) => ({
      ...current,
      imageRows: current.imageRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, url: value } : row,
      ),
    }));
  };

  const addStockRow = () => {
    setForm((current) => ({
      ...current,
      stockRows: [...current.stockRows, { size: "", stock: 0 }],
    }));
  };

  const addImageRow = () => {
    setForm((current) => ({
      ...current,
      imageRows:
        current.imageRows.length >= MAX_EXTRA_IMAGES
          ? current.imageRows
          : [...current.imageRows, { url: "" }],
    }));
  };

  const removeStockRow = (index) => {
    setForm((current) => ({
      ...current,
      stockRows: current.stockRows.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const removeImageRow = (index) => {
    setForm((current) => ({
      ...current,
      imageRows: current.imageRows.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const resetToNewProduct = () => {
    setSelectedProductId(null);
    setForm(buildFormFromProduct(null, nextProductId));
    setSuccessMessage("");
    setError("");
    setImageWarning("");
  };

  const selectProduct = (product) => {
    setSelectedProductId(product.id);
    setSuccessMessage("");
    setError("");
    setImageWarning("");
  };

  const handleUserFieldChange = (field, value) => {
    setUserForm((current) => ({ ...current, [field]: value }));
  };

  const handleUserRoleChange = (role, checked) => {
    setUserForm((current) => ({
      ...current,
      roles: {
        ...current.roles,
        [role]: checked,
      },
    }));
  };

  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      password: "",
      roles: {
        user: true,
        admin: false,
      },
    });
    setUserRegisterError("");
    setUserRegisterSuccess("");
  };

  const submitUserRegistration = async (event) => {
    event.preventDefault();

    if (!accessToken) {
      setUserRegisterError("No hay sesión activa.");
      return;
    }

    const roles = ["user"];
    if (userForm.roles.admin) {
      roles.push("admin");
    }

    setIsRegisteringUser(true);
    setUserRegisterError("");
    setUserRegisterSuccess("");

    try {
      await requestJson("/auth/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          password: userForm.password,
          roles,
        }),
      });

      setUserRegisterSuccess("Usuario registrado correctamente.");
      resetUserForm();
    } catch (requestError) {
      setUserRegisterError(
        requestError.message || "No se pudo registrar el usuario.",
      );
    } finally {
      setIsRegisteringUser(false);
    }
  };

  const submitProduct = async (event) => {
    event.preventDefault();

    if (!accessToken) {
      setError("No hay sesión activa.");
      return;
    }

    const mainImage = form.image.trim();
    const rawExtraImages = form.imageRows
      .map((row) => row.url.trim())
      .filter(Boolean);

    const seenImages = new Set(mainImage ? [mainImage] : []);
    const uniqueExtraImages = [];
    const duplicateImages = [];

    for (const image of rawExtraImages) {
      if (seenImages.has(image)) {
        duplicateImages.push(image);
        continue;
      }

      seenImages.add(image);
      uniqueExtraImages.push(image);
    }

    if (uniqueExtraImages.length > MAX_EXTRA_IMAGES) {
      uniqueExtraImages.length = MAX_EXTRA_IMAGES;
    }

    const payload = {
      id: Number(form.id),
      brand: form.brand.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      originalPrice:
        form.originalPrice === "" || form.originalPrice === null
          ? null
          : Number(form.originalPrice),
      badge: form.badge.trim(),
      image: mainImage,
      images: uniqueExtraImages,
      subcategories: splitLines(form.subcategoriesText),
      category: form.category.trim().toLowerCase(),
      isOffer: Boolean(form.isOffer),
      stockBySize: form.stockRows
        .map((row) => ({
          size: String(row.size || "")
            .trim()
            .toUpperCase(),
          stock: Number(row.stock) || 0,
        }))
        .filter((row) => row.size),
    };

    setIsSaving(true);
    setError("");
    setSuccessMessage("");
    setImageWarning("");

    try {
      const requestOptions = {
        method: selectedProduct ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      };

      const endpoint = selectedProduct
        ? `/products/${selectedProduct.id}`
        : "/products";
      const savedProduct = await requestJson(endpoint, requestOptions);

      const refreshedProducts = await requestJson("/products");
      const refreshedList = Array.isArray(refreshedProducts)
        ? refreshedProducts
        : [];
      setProducts(refreshedList);
      setSelectedProductId(savedProduct.id ?? payload.id);
      setSuccessMessage(
        selectedProduct
          ? "Producto actualizado correctamente."
          : "Producto registrado correctamente.",
      );
      if (duplicateImages.length > 0) {
        setImageWarning(
          `Se omitieron ${duplicateImages.length} URL${duplicateImages.length === 1 ? "" : "s"} repetida${duplicateImages.length === 1 ? "" : "s"}. La imagen principal no cuenta como extra.`,
        );
      }
    } catch (requestError) {
      setError(requestError.message || "No se pudo guardar el producto.");
    } finally {
      setIsSaving(false);
    }
  };

  const previewImages = useMemo(() => {
    const mainImage = form.image.trim();
    const extraImages = form.imageRows
      .map((row) => row.url.trim())
      .filter(Boolean);
    return Array.from(
      new Set([mainImage, ...extraImages].filter(Boolean)),
    ).slice(0, MAX_TOTAL_IMAGES);
  }, [form.image, form.imageRows]);

  const duplicateImageCount = useMemo(() => {
    const mainImage = form.image.trim();
    const extraImages = form.imageRows
      .map((row) => row.url.trim())
      .filter(Boolean);

    const seen = new Set(mainImage ? [mainImage] : []);
    let duplicates = 0;

    for (const image of extraImages) {
      if (seen.has(image)) {
        duplicates += 1;
        continue;
      }

      seen.add(image);
    }

    return duplicates;
  }, [form.image, form.imageRows]);

  if (!isAdmin) {
    return (
      <section className="admin-page">
        <div className="admin-state admin-state-error">
          No tienes permisos para acceder a esta sección.
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-hero">
        <div>
          <span className="admin-eyebrow">Panel de administración</span>
          <h1>Gestiona productos, stock e imágenes</h1>
          <p>
            Registra nuevos productos, ajusta stock por talla y actualiza la
            galería de hasta 5 imágenes por producto.
          </p>
        </div>
        <button
          type="button"
          className="admin-secondary-btn"
          onClick={resetToNewProduct}
        >
          Nuevo producto
        </button>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h2>Productos</h2>
          {isLoading ? (
            <div className="admin-state">Cargando productos...</div>
          ) : error ? (
            <div className="admin-state admin-state-error">{error}</div>
          ) : (
            <div className="admin-product-list">
              {products.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  className={`admin-product-item ${selectedProductId === product.id ? "active" : ""}`}
                  onClick={() => selectProduct(product)}
                >
                  <strong>
                    #{product.id} {product.name}
                  </strong>
                  <span>{product.brand}</span>
                  <small>
                    Stock: {product.stock ?? 0} | Imágenes:{" "}
                    {(product.images ?? []).length || 1}
                  </small>
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="admin-main">
          <form className="admin-form" onSubmit={submitProduct}>
            <section className="admin-section">
              <div className="admin-section-header">
                <h2>
                  {selectedProduct ? "Editar producto" : "Crear producto"}
                </h2>
                <span>
                  {selectedProduct
                    ? `ID ${selectedProduct.id}`
                    : `Nuevo ID sugerido ${nextProductId}`}
                </span>
              </div>

              <div className="admin-grid admin-grid-2">
                <label>
                  ID
                  <input
                    type="number"
                    value={form.id}
                    onChange={(event) =>
                      handleFieldChange("id", event.target.value)
                    }
                    disabled={Boolean(selectedProduct)}
                    min="1"
                  />
                </label>
                <label>
                  Marca
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(event) =>
                      handleFieldChange("brand", event.target.value)
                    }
                    required
                  />
                </label>
              </div>

              <label>
                Nombre
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    handleFieldChange("name", event.target.value)
                  }
                  required
                />
              </label>

              <div className="admin-grid admin-grid-3">
                <label>
                  Categoría
                  <input
                    type="text"
                    value={form.category}
                    onChange={(event) =>
                      handleFieldChange("category", event.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  Precio
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      handleFieldChange("price", event.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  Precio original
                  <input
                    type="number"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(event) =>
                      handleFieldChange("originalPrice", event.target.value)
                    }
                  />
                </label>
              </div>

              <label>
                Badge
                <input
                  type="text"
                  value={form.badge}
                  onChange={(event) =>
                    handleFieldChange("badge", event.target.value)
                  }
                  placeholder="NEW\n25% OFF"
                />
              </label>

              <label>
                Imagen principal
                <input
                  type="url"
                  value={form.image}
                  onChange={(event) =>
                    handleFieldChange("image", event.target.value)
                  }
                  placeholder="https://..."
                  required
                />
              </label>

              <div className="admin-grid admin-grid-2">
                <label>
                  Subcategorías
                  <textarea
                    rows="5"
                    value={form.subcategoriesText}
                    onChange={(event) =>
                      handleFieldChange("subcategoriesText", event.target.value)
                    }
                    placeholder="blusas y camisas\nvestidos\npantalones"
                  />
                </label>
              </div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.isOffer}
                  onChange={(event) =>
                    handleFieldChange("isOffer", event.target.checked)
                  }
                />
                Producto en oferta
              </label>
            </section>

            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Imágenes extra</h2>
                <button
                  type="button"
                  className="admin-link-btn"
                  onClick={addImageRow}
                >
                  Agregar imagen
                </button>
              </div>

              <div className="admin-image-list">
                {form.imageRows.map((row, index) => (
                  <div className="admin-image-row" key={`image-${index}`}>
                    <input
                      type="url"
                      value={row.url}
                      onChange={(event) =>
                        handleImageRowChange(index, event.target.value)
                      }
                      placeholder={`URL de imagen extra ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="admin-remove-btn"
                      onClick={() => removeImageRow(index)}
                      disabled={form.imageRows.length === 1}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              <p className="admin-helper-text">
                La imagen principal ya cuenta como una. Puedes registrar hasta 4
                extras.
              </p>
              {duplicateImageCount > 0 && (
                <p className="admin-warning">
                  Hay {duplicateImageCount} imagen
                  {duplicateImageCount === 1 ? "" : "es"} repetida
                  {duplicateImageCount === 1 ? "" : "s"}. Esas URLs se omiten al
                  guardar porque ya existe la imagen principal o se repiten
                  entre extras.
                </p>
              )}
            </section>

            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Stock por talla</h2>
                <button
                  type="button"
                  className="admin-link-btn"
                  onClick={addStockRow}
                >
                  Agregar talla
                </button>
              </div>

              <div className="admin-stock-list">
                {form.stockRows.map((row, index) => (
                  <div className="admin-stock-row" key={`${row.size}-${index}`}>
                    <input
                      type="text"
                      value={row.size}
                      onChange={(event) =>
                        handleStockRowChange(index, "size", event.target.value)
                      }
                      placeholder="Talla"
                    />
                    <input
                      type="number"
                      min="0"
                      value={row.stock}
                      onChange={(event) =>
                        handleStockRowChange(index, "stock", event.target.value)
                      }
                      placeholder="Stock"
                    />
                    <button
                      type="button"
                      className="admin-remove-btn"
                      onClick={() => removeStockRow(index)}
                      disabled={form.stockRows.length === 1}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              <p className="admin-helper-text">
                El stock total se recalcula automáticamente al guardar.
              </p>
            </section>

            <section className="admin-section admin-section-preview">
              <div className="admin-section-header">
                <h2>Vista previa de imágenes</h2>
                <span>{previewImages.length} / 5</span>
              </div>
              <div className="admin-preview-grid">
                {previewImages.map((image, index) => (
                  <div className="admin-preview-tile" key={`${image}-${index}`}>
                    <img src={image} alt={`Vista previa ${index + 1}`} />
                  </div>
                ))}
              </div>
            </section>

            <div className="admin-actions">
              <button
                type="submit"
                className="admin-primary-btn"
                disabled={isSaving}
              >
                {isSaving
                  ? "Guardando..."
                  : selectedProduct
                    ? "Guardar cambios"
                    : "Registrar producto"}
              </button>
              {successMessage && (
                <p className="admin-success">{successMessage}</p>
              )}
              {imageWarning && <p className="admin-warning">{imageWarning}</p>}
              {error && <p className="admin-error">{error}</p>}
            </div>
          </form>

          <section className="admin-section admin-user-section">
            <div className="admin-section-header">
              <h2>Registrar usuarios</h2>
              <span>Solo accesible para administradores</span>
            </div>

            <form className="admin-user-form" onSubmit={submitUserRegistration}>
              <div className="admin-grid admin-grid-2">
                <label>
                  Nombre
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(event) =>
                      handleUserFieldChange("name", event.target.value)
                    }
                    required
                    minLength={2}
                  />
                </label>
                <label>
                  Correo
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(event) =>
                      handleUserFieldChange("email", event.target.value)
                    }
                    required
                  />
                </label>
              </div>

              <div className="admin-grid admin-grid-2">
                <label>
                  Contraseña
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(event) =>
                      handleUserFieldChange("password", event.target.value)
                    }
                    required
                    minLength={8}
                  />
                </label>

                <div className="admin-user-roles">
                  <span>Roles</span>
                  <label className="admin-checkbox admin-checkbox-inline">
                    <input type="checkbox" checked disabled />
                    Usuario básico
                  </label>
                  <label className="admin-checkbox admin-checkbox-inline">
                    <input
                      type="checkbox"
                      checked={userForm.roles.admin}
                      onChange={(event) =>
                        handleUserRoleChange("admin", event.target.checked)
                      }
                    />
                    Admin
                  </label>
                </div>
              </div>

              <div className="admin-actions">
                <button
                  type="submit"
                  className="admin-primary-btn"
                  disabled={isRegisteringUser}
                >
                  {isRegisteringUser ? "Registrando..." : "Registrar usuario"}
                </button>
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={resetUserForm}
                >
                  Limpiar
                </button>
                {userRegisterSuccess && (
                  <p className="admin-success">{userRegisterSuccess}</p>
                )}
                {userRegisterError && (
                  <p className="admin-error">{userRegisterError}</p>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
