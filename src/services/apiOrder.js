import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://shopDirect-api.onrender.com/api/v4",
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
    console.error("API Error Status:", error.response?.status);
    console.error("API Error Headers:", error.response?.headers);
    return Promise.reject(error);
  }
);

export const getOrders = async () => {
  try {
    console.log("Making orders API request...");
    const response = await api.get("/orders");
    console.log("Orders API response:", response.data);
    console.log("Orders API response status:", response.status);
    console.log("Orders API response headers:", response.headers);
    
    // Handle different response structures
    const orders = response.data?.data?.orders || response.data?.data || response.data || [];
    console.log("Processed orders:", orders);
    console.log("Number of orders:", orders.length);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data.order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch order");
  }
};

// Mark order as delivered
export const deliverOrder = async (orderId) => {
  try {
    const response = await api.patch(`/orders/${orderId}/deliver`);
    return response.data;
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    throw new Error(error.response?.data?.message || "Failed to mark order as delivered");
  }
};