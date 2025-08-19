import { useQuery } from "@tanstack/react-query";
import { getAnalyticsData } from "../../services/apiAnalytics";

export function useAnalytics() {
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Analytics query error:", error);
    },
  });

  return {
    stats: analyticsData?.stats || {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      revenueChange: 0,
      ordersChange: 0,
      customersChange: 0,
      productsChange: 0,
    },
    salesData: analyticsData?.salesData || [],
    categoryData: analyticsData?.categoryData || [],
    topProducts: analyticsData?.topProducts || [],
    customerSegments: analyticsData?.customerSegments || [],
    isLoading,
    error,
    refetch,
  };
}
