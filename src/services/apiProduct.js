import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api/v4",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add request interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getProducts = async (page = 1, search = '', category = 'all', sort = 'name', limit = 10) => {
  try {
    // Build query parameters - only send parameters that your backend supports
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page);
    if (limit !== 10) params.append('limit', limit);
    // Note: search parameter might not be supported by your backend yet
    // if (search) params.append('search', search);
    if (category && category !== 'all') params.append('category', category);
    if (sort) params.append('sort', sort);

    console.log('API Request Parameters:', { page, search, category, sort, limit });
    console.log('API URL:', `/products?${params.toString()}`);

    const response = await api.get(`/products?${params.toString()}`);
    
    // Return the full response data including pagination info
    return {
      products: response.data.data.products,
      total: response.data.total,
      results: response.data.results,
      page: page,
      totalPages: Math.ceil(response.data.total / limit)
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data.data.product; // Return the product object
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

export const createProduct = async (productData) => {
  try {
    const formData = new FormData();

    // Append basic product data
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price.toString());
    formData.append("category", productData.category);

    // Append images if provided
    if (productData.imageCover && productData.imageCover[0]) {
      formData.append("imageCover", productData.imageCover[0]);
    }

    if (productData.images && productData.images.length) {
      Array.from(productData.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const formData = new FormData();

    // Append basic product data
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price.toString());
    formData.append("category", productData.category);

    // Append images if provided
    if (productData.imageCover && productData.imageCover[0]) {
      formData.append("imageCover", productData.imageCover[0]);
    }

    if (productData.images && productData.images.length) {
      Array.from(productData.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await api.patch(`/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};

export const deleteProduct = async (productId) => {
  try {
    await api.delete(`/products/${productId}`);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error(error.response?.data?.message || "Failed to delete product");
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data.data.categories; // Return the categories array
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch categories");
  }
};
