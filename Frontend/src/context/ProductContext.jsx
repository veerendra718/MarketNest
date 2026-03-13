import { createContext, useContext, useState, useCallback } from "react";
import API from "../api/axios";

const ProductContext = createContext(null);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch marketplace products
  const getMarketplace = useCallback(
    async (search = "", category = "All Categories", page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        if (category && category !== "All Categories")
          params.category = category;

        const { data } = await API.get("/products", { params });
        setProducts(data.products);
        setTotalPages(data.totalPages);
        return data;
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch products";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch single product
  const getProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/products/${id}`);
      return data.product;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch product";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products Brand
  const getMyProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get("/products/my");
      setProducts(data.products);
      return data.products;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch your products";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dashboard stats
  const getDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get("/products/dashboard");
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch dashboard stats";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post("/products", productData);
      return data.product;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create product";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.put(`/products/${id}`, productData);
      return data.product;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update product";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await API.delete(`/products/${id}`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete product";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    products,
    loading,
    error,
    totalPages,
    getMarketplace,
    getProductById,
    getMyProducts,
    getDashboardStats,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
