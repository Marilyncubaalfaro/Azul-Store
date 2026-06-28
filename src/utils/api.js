const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message;
    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : message || "Error en la peticion.",
    );
  }

  return payload;
}
