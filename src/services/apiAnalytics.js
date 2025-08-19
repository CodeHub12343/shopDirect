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
    return Promise.reject(error);
  }
);

// Get comprehensive analytics data
export const getAnalyticsData = async () => {
  try {
    console.log("Fetching analytics data...");

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

    // Calculate basic statistics
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

    // Generate sales data for charts (last 12 months)
    const currentDate = new Date();
    const salesData = [];
    for (let i = 11; i >= 0; i--) {
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
      const monthCustomers = customers.filter((customer) => {
        const customerDate = new Date(customer.createdAt);
        return (
          customerDate.getMonth() === date.getMonth() &&
          customerDate.getFullYear() === date.getFullYear()
        );
      });

      salesData.push({
        name: monthName,
        sales: monthSales,
        orders: monthOrders.length,
        customers: monthCustomers.length,
      });
    }

    // Generate category data based on actual sales
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

    // Calculate top performing products
    const productSales = {};
    orders.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          const productName = item.product?.name || "Unknown Product";
          if (!productSales[productName]) {
            productSales[productName] = { sales: 0, revenue: 0 };
          }
          productSales[productName].sales += item.quantity || 0;
          productSales[productName].revenue +=
            (item.price || 0) * (item.quantity || 0);
        });
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate customer segments
    const customerSegments = calculateCustomerSegments(customers, orders);

    return {
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueChange: Math.round(revenueChange * 10) / 10,
        ordersChange: Math.round(ordersChange * 10) / 10,
        customersChange: Math.round(customersChange * 10) / 10,
        productsChange: 0,
      },
      salesData,
      categoryData,
      topProducts,
      customerSegments,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
};

// Helper function to calculate customer segments
const calculateCustomerSegments = (customers, orders) => {
  const customerOrderCount = {};

  // Count orders per customer
  orders.forEach((order) => {
    const customerId = order.user?._id || order.user;
    if (customerId) {
      customerOrderCount[customerId] =
        (customerOrderCount[customerId] || 0) + 1;
    }
  });

  // Categorize customers
  let newCustomers = 0;
  let returningCustomers = 0;
  let loyalCustomers = 0;

  customers.forEach((customer) => {
    const orderCount = customerOrderCount[customer._id] || 0;
    if (orderCount === 0) {
      newCustomers++;
    } else if (orderCount <= 2) {
      returningCustomers++;
    } else {
      loyalCustomers++;
    }
  });

  const total = customers.length;

  return [
    {
      segment: "New Customers",
      count: newCustomers,
      percentage: total > 0 ? Math.round((newCustomers / total) * 100) : 0,
    },
    {
      segment: "Returning",
      count: returningCustomers,
      percentage:
        total > 0 ? Math.round((returningCustomers / total) * 100) : 0,
    },
    {
      segment: "Loyal",
      count: loyalCustomers,
      percentage: total > 0 ? Math.round((loyalCustomers / total) * 100) : 0,
    },
  ];
};

// Get detailed revenue analytics
export const getRevenueAnalytics = async () => {
  try {
    const ordersRes = await api.get("/orders");
    const orders = ordersRes.data?.data?.orders || ordersRes.data?.data || [];

    // Calculate revenue by month for the last 12 months
    const currentDate = new Date();
    const revenueByMonth = [];

    for (let i = 11; i >= 0; i--) {
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

      const monthRevenue = monthOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      revenueByMonth.push({
        month: monthName,
        revenue: monthRevenue,
        orders: monthOrders.length,
      });
    }

    return revenueByMonth;
  } catch (error) {
    console.error("Error fetching revenue analytics:", error);
    throw new Error("Failed to fetch revenue analytics");
  }
};

// Get customer analytics
export const getCustomerAnalytics = async () => {
  try {
    const customersRes = await api.get("/users");

    const customers =
      customersRes.data?.data?.users || customersRes.data?.data || [];

    // Calculate customer growth by month
    const currentDate = new Date();
    const customerGrowth = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      const monthCustomers = customers.filter((customer) => {
        const customerDate = new Date(customer.createdAt);
        return (
          customerDate.getMonth() === date.getMonth() &&
          customerDate.getFullYear() === date.getFullYear()
        );
      });

      customerGrowth.push({
        month: monthName,
        customers: monthCustomers.length,
      });
    }

    return customerGrowth;
  } catch (error) {
    console.error("Error fetching customer analytics:", error);
    throw new Error("Failed to fetch customer analytics");
  }
};

// Get product performance analytics
export const getProductAnalytics = async () => {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      api.get("/products"),
      api.get("/orders"),
    ]);

    const products =
      productsRes.data?.data?.products || productsRes.data?.data || [];
    const orders = ordersRes.data?.data?.orders || ordersRes.data?.data || [];

    // Calculate product performance
    const productPerformance = products.map((product) => {
      let totalSales = 0;
      let totalRevenue = 0;

      orders.forEach((order) => {
        if (order.orderItems && Array.isArray(order.orderItems)) {
          order.orderItems.forEach((item) => {
            if (
              item.product?._id === product._id ||
              item.product === product._id
            ) {
              totalSales += item.quantity || 0;
              totalRevenue += (item.price || 0) * (item.quantity || 0);
            }
          });
        }
      });

      return {
        name: product.name,
        sales: totalSales,
        revenue: totalRevenue,
        rating: product.ratingsAverage || 0,
        views: product.ratingsQuantity || 0,
      };
    });

    // Sort by revenue and return top 10
    return productPerformance
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    throw new Error("Failed to fetch product analytics");
  }
};

