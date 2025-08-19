import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../../services/apiDashboard";

export function useDashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Dashboard query error:", error);
    },
  });

  return {
    stats: dashboardData?.stats || {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      revenueChange: 0,
      ordersChange: 0,
      customersChange: 0,
      productsChange: 0,
    },
    salesData: dashboardData?.salesData || [],
    categoryData: dashboardData?.categoryData || [],
    recentOrders: dashboardData?.recentOrders || [],
    popularProducts: dashboardData?.popularProducts || [],
    isLoading,
    error,
    isError,
    refetch,
  };
}
