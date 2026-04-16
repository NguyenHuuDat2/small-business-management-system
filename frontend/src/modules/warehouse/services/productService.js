const API = "http://127.0.0.1:8000/api";

// ===== PRODUCTS =====
export const getProducts = async () => {
  const res = await fetch(`${API}/products`);
  return res.json();
};

export const createProduct = async (data) => {
  await fetch(`${API}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateProduct = async (id, data) => {
  await fetch(`${API}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteProduct = async (id) => {
  await fetch(`${API}/products/${id}`, {
    method: "DELETE",
  });
};

// ===== CATEGORY =====
export const getCategories = async () => {
  const res = await fetch(`${API}/categories`);
  return res.json();
};

// ===== UNIT =====
export const getUnits = async () => {
  const res = await fetch(`${API}/units`);
  return res.json();
};