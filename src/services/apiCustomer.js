/* import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://shopDirect-api.onrender.com/api/v4",
  withCredentials: true, // ✅ Sends cookies/JWT
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

export async function getCustomers() {
  try {
    console.log("Fetching customers from:", api.defaults.baseURL + "/users");
    const res = await api.get("/users");
    console.log("Customers response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Get customers error:", err);
    console.error("Error response:", err.response);
    console.error("Error message:", err.message);
    throw new Error(
      err.response?.data?.message || err.message || "Error fetching customers"
    );
  }
}

export async function getCustomerById(id) {
  try {
    console.log("Fetching customer by ID:", id);
    console.log("API URL:", api.defaults.baseURL + `/users/${id}`);
    const res = await api.get(`/users/${id}`);
    console.log("Customer by ID response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Get customer by ID error:", err);
    console.error("Error response:", err.response);
    console.error("Error message:", err.message);
    throw new Error(
      err.response?.data?.message || err.message || "Error fetching customer"
    );
  }
} */

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

export async function getCustomers() {
  try {
    console.log("Fetching customers from:", api.defaults.baseURL + "/users");
    const res = await api.get("/users");
    console.log("Customers response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Get customers error:", err);
    console.error("Error response:", err.response);
    console.error("Error message:", err.message);
    throw new Error(
      err.response?.data?.message || err.message || "Error fetching customers"
    );
  }
}

export async function getCustomerById(id) {
  try {
    console.log("Fetching customer by ID:", id);
    console.log("API URL:", api.defaults.baseURL + `/users/${id}`);
    const res = await api.get(`/users/${id}`);
    console.log("Customer by ID response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Get customer by ID error:", err);
    console.error("Error response:", err.response);
    console.error("Error message:", err.message);
    throw new Error(
      err.response?.data?.message || err.message || "Error fetching customer"
    );
  }
}
