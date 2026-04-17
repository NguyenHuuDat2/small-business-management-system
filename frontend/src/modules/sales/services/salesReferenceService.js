import axiosClient from "../../../shared/api/axiosClient";

const CACHE_TTL = 1000 * 60 * 5;

const customerCache = new Map();
const productCache = new Map();

function buildKey(prefix, params = {}) {
  return `${prefix}:${JSON.stringify(params)}`;
}

function getCache(cacheMap, key) {
  const cached = cacheMap.get(key);

  if (!cached) return null;
  if (Date.now() - cached.createdAt > CACHE_TTL) {
    cacheMap.delete(key);
    return null;
  }

  return cached.data;
}

function setCache(cacheMap, key, data) {
  cacheMap.set(key, {
    data,
    createdAt: Date.now(),
  });
}

export const salesReferenceService = {
  async getCustomers(params = {}) {
    const normalized = {
      q: params.q || "",
      limit: params.limit || 20,
    };

    const key = buildKey("customers", normalized);
    const cached = getCache(customerCache, key);

    if (cached) return cached;

    const response = await axiosClient.get("/sales/reference/customers", {
      params: normalized,
    });

    const data = response.data?.data || [];
    setCache(customerCache, key, data);

    return data;
  },

  async getProducts(params = {}) {
    const normalized = {
      q: params.q || "",
      limit: params.limit || 20,
      category_id: params.category_id || "",
    };

    const key = buildKey("products", normalized);
    const cached = getCache(productCache, key);

    if (cached) return cached;

    const response = await axiosClient.get("/sales/reference/products", {
      params: normalized,
    });

    const data = response.data?.data || [];
    setCache(productCache, key, data);

    return data;
  },

  clearCustomerCache() {
    customerCache.clear();
  },

  clearProductCache() {
    productCache.clear();
  },

  clearAllCache() {
    customerCache.clear();
    productCache.clear();
  },
};