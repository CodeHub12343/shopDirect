import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://shopdirect-api.onrender.com/api/v4",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Dashboard statistics
export const getDashboardStats = async () => {
  try {
    console.log("Fetching dashboard stats...");

    // Fetch all data in parallel
    const [customersRes, ordersRes, productsRes] = await Promise.all([
      api.get("/users"),
      api.get("/orders"),
      api.get("/products"),
    ]);

    const customers =
      customersRes.data?.data?.users || customersRes.data?.data || [];
    const orders = ordersRes.data?.data?.orders || ordersRes.data?.data || [];
    const products =
      productsRes.data?.data?.products || productsRes.data?.data || [];

    // Calculate statistics
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalProducts =
      (typeof productsRes.data?.total === 'number' && productsRes.data.total) ||
      (typeof productsRes.data?.results === 'number' && productsRes.data.results) ||
      products.length;

    // Calculate month-over-month changes
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });

    const lastMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        orderDate.getMonth() === lastMonth &&
        orderDate.getFullYear() === lastMonthYear
      );
    });

    const currentMonthRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );

    const revenueChange =
      lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;
    const ordersChange =
      lastMonthOrders.length > 0
        ? ((currentMonthOrders.length - lastMonthOrders.length) /
            lastMonthOrders.length) *
          100
        : 0;

    // Calculate customer growth
    const currentMonthCustomers = customers.filter((customer) => {
      const customerDate = new Date(customer.createdAt);
      return (
        customerDate.getMonth() === currentMonth &&
        customerDate.getFullYear() === currentYear
      );
    });

    const lastMonthCustomers = customers.filter((customer) => {
      const customerDate = new Date(customer.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        customerDate.getMonth() === lastMonth &&
        customerDate.getFullYear() === lastMonthYear
      );
    });

    const customersChange =
      lastMonthCustomers.length > 0
        ? ((currentMonthCustomers.length - lastMonthCustomers.length) /
            lastMonthCustomers.length) *
          100
        : 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersChange: Math.round(ordersChange * 10) / 10,
      customersChange: Math.round(customersChange * 10) / 10,
      productsChange: 0, // We'll calculate this if needed
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
};

// Sales data for charts
export const getSalesData = async () => {
  try {
    console.log("Fetching sales data...");

    const ordersRes = await api.get("/orders");

    const orders = ordersRes.data?.data?.orders || ordersRes.data?.data || [];

    // Group orders by month for the last 7 months
    const months = [];
    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      });

      const monthSales = monthOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      months.push({
        name: monthName,
        sales: monthSales,
        orders: monthOrders.length,
      });
    }

    return months;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw new Error("Failed to fetch sales data");
  }
};

// Category data for pie chart - FIXED: Now based on actual sales revenue
export const getCategoryData = async () => {
  try {
    console.log("Fetching category data...");

    const [productsRes, ordersRes] = await Promise.all([
      api.get("/products"),
      api.get("/orders"),
    ]);

    const products =
      productsRes.data?.data?.products || productsRes.data?.data || [];
    const orders = ordersRes.data?.data?.orders || ordersRes.data?.data || [];

    // Group products by category based on actual sales revenue
    const categorySales = {};
    orders.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          const product = item.product;
          if (product) {
            let category = product.category || "Uncategorized";

            // Ensure category is a string
            if (typeof category === "object" && category !== null) {
              category = category.name || category.title || JSON.stringify(category);
            } else if (typeof category !== "string") {
              category = String(category);
            }

            const itemRevenue = (item.price || 0) * (item.quantity || 0);
            categorySales[category] = (categorySales[category] || 0) + itemRevenue;
          }
        });
      }
    });

    // If no sales data, fall back to product count by category
    if (Object.keys(categorySales).length === 0) {
      products.forEach((product) => {
        let category = product.category || "Uncategorized";

        // Ensure category is a string
        if (typeof category === "object" && category !== null) {
          category = category.name || category.title || JSON.stringify(category);
        } else if (typeof category !== "string") {
          category = String(category);
        }

        categorySales[category] = (categorySales[category] || 0) + 1;
      });
    }

    // Convert to chart format
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#f59e0b",
      "#10b981",
      "#ef4444",
      "#06b6d4",
      "#84cc16",
      "#f97316",
    ];
    const categoryData = Object.entries(categorySales).map(
      ([name, value], index) => ({
        name: String(name), // Ensure name is always a string
        value: Math.round(value), // Round to nearest dollar
        color: colors[index % colors.length],
      })
    );

    return categoryData;
  } catch (error) {
    console.error("Error fetching category data:", error);
    throw new Error("Failed to fetch category data");
  }
};

// Recent orders - COMPLETELY REWRITTEN: Proper order data handling
export const getRecentOrders = async (limit = 5) => {
  try {
    console.log("Fetching recent orders...");

    const ordersRes = await api.get("/orders");
    const orders = ordersRes.data?.data?.orders || ordersRes.data?.data || [];

    console.log("Total orders received:", orders.length);
    console.log("Sample order structure:", orders[0]);

    // Filter and sort orders properly
    const validOrders = orders.filter(order => {
      // Filter out invalid orders
      const isValid = order && 
                     order._id && 
                     order.createdAt && 
                     !isNaN(new Date(order.createdAt).getTime());
      
      if (!isValid) {
        console.log("Invalid order filtered out:", order);
      }
      
      return isValid;
    });

    console.log("Valid orders after filtering:", validOrders.length);

    const recentOrders = validOrders
      .sort((a, b) => {
        // Sort by creation date (most recent first)
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      })
      .slice(0, limit)
      .map((order) => {
        try {
          const timeAgo = getTimeAgo(new Date(order.createdAt));
          
          // Extract customer name with better logic
          let customerName = "Unknown Customer";
          if (order.user) {
            if (typeof order.user === 'object') {
              // Handle populated user object
              customerName = order.user.name || order.user.email || "Unknown Customer";
            } else if (typeof order.user === 'string') {
              // Handle user ID string
              customerName = order.user;
            }
          }
          
          // Determine order status with priority
          let status = "Pending";
          if (order.paymentStatus) {
            status = order.paymentStatus;
          } else if (order.status) {
            status = order.status;
          } else if (order.isDelivered) {
            status = "Delivered";
          } else if (order.isPaid) {
            status = "Paid";
          }
          
          // Calculate total items in order
          let totalItems = 0;
          if (order.orderItems && Array.isArray(order.orderItems)) {
            totalItems = order.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
          }
          
          // Format order ID properly
          const orderId = order._id ? `#${order._id.slice(-8).toUpperCase()}` : `#${Date.now().toString().slice(-8)}`;
          
          // Format amount with proper currency
          const amount = order.totalPrice ? `$${parseFloat(order.totalPrice).toFixed(2)}` : "$0.00";
          
          const processedOrder = {
            id: orderId,
            customer: customerName,
            amount: amount,
            status: status,
            time: timeAgo,
            totalItems: totalItems,
            orderDate: new Date(order.createdAt).toLocaleDateString(),
            // Additional useful data
            orderItems: order.orderItems || [],
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
          };

          console.log("Processed order:", processedOrder);
          return processedOrder;
        } catch (orderError) {
          console.error("Error processing individual order:", orderError, order);
          return {
            id: `#ERROR`,
            customer: "Error Processing",
            amount: "$0.00",
            status: "Error",
            time: "Unknown",
            totalItems: 0,
            orderDate: "Unknown",
          };
        }
      });

    console.log("Final processed recent orders:", recentOrders);
    return recentOrders;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw new Error("Failed to fetch recent orders");
  }
};

// Popular products - FIXED: Now based on actual sales performance
export const getPopularProducts = async (limit = 5) => {
  try {
    console.log("Fetching popular products...");

    const [productsRes, ordersRes] = await Promise.all([
      api.get("/products"),
      api.get("/orders"),
    ]);

    const products =
      productsRes.data?.data?.products || productsRes.data?.data || [];
    const orders = ordersRes.data?.data?.orders || ordersRes.data?.data || [];

    console.log("Products fetched:", products.length);
    console.log("Orders fetched:", orders.length);
    console.log("Sample product:", products[0]);
    console.log("Sample order:", orders[0]);

    // Calculate product sales performance
    const productSales = {};
    orders.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          const product = item.product;
          if (product) {
            console.log("Processing order item product:", product);
            
            const productId = product._id || product.id;
            let productName = "Unknown Product";
            
            // Try to get product name from multiple sources
            if (product.name) {
              productName = product.name;
            } else if (product.productName) {
              productName = product.productName;
            } else if (product.title) {
              productName = product.title;
            }
            
            // If we still don't have a name, try to find it in the products array
            if (productName === "Unknown Product" && productId) {
              const foundProduct = products.find(p => p._id === productId || p.id === productId);
              if (foundProduct && foundProduct.name) {
                productName = foundProduct.name;
              }
            }
            
            if (!productSales[productId]) {
              productSales[productId] = {
                name: productName,
                sales: 0,
                revenue: 0,
                rating: product.ratingsAverage || 0,
                views: product.ratingsQuantity || 0,
                createdAt: product.createdAt || new Date()
              };
            }
            
            productSales[productId].sales += item.quantity || 0;
            productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
          }
        });
      }
    });

    console.log("Product sales calculated:", productSales);

    // If no sales data, fall back to rating-based sorting
    let popularProducts;
    if (Object.keys(productSales).length === 0) {
      console.log("No sales data, falling back to rating-based sorting");
      popularProducts = products
        .filter(product => product.name && product.name !== "Unknown Product")
        .sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0))
        .slice(0, limit)
        .map((product) => {
          const timeAgo = getTimeAgo(new Date(product.createdAt));
          return {
            name: product.name,
            views: product.ratingsQuantity || 0,
            rating: product.ratingsAverage || 0,
            time: timeAgo,
          };
        });
    } else {
      // Sort by revenue (most popular based on sales)
      console.log("Sorting by sales performance");
      popularProducts = Object.values(productSales)
        .filter(product => product.name && product.name !== "Unknown Product")
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit)
        .map((product) => {
          const timeAgo = getTimeAgo(new Date(product.createdAt));
          return {
            name: product.name,
            views: product.views,
            rating: product.rating,
            time: timeAgo,
            sales: product.sales,
            revenue: product.revenue,
          };
        });
    }

    console.log("Final popular products:", popularProducts);
    return popularProducts;
  } catch (error) {
    console.error("Error fetching popular products:", error);
    throw new Error("Failed to fetch popular products");
  }
};

// Helper function to calculate time ago - IMPROVED: Better edge case handling
const getTimeAgo = (date) => {
  try {
    const now = new Date();
    const targetDate = new Date(date);
    
    // Handle invalid dates
    if (isNaN(targetDate.getTime())) {
      return "Unknown time";
    }
    
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    // Handle future dates
    if (diffInSeconds < 0) {
      return "Just now";
    }

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    console.error("Error calculating time ago:", error);
    return "Unknown time";
  }
};

// Get all dashboard data in one call
export const getDashboardData = async () => {
  try {
    console.log("Fetching all dashboard data...");

    const [stats, salesData, categoryData, recentOrders, popularProducts] =
      await Promise.all([
        getDashboardStats(),
        getSalesData(),
        getCategoryData(),
        getRecentOrders(),
        getPopularProducts(),
      ]);

    return {
      stats,
      salesData,
      categoryData,
      recentOrders,
      popularProducts,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
};