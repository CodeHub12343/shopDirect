import { useQuery } from "@tanstack/react-query";
import { getProductAnalytics } from "../../services/apiAnalytics";

export const useProductAnalytics = () => {
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["productAnalytics"],
    queryFn: getProductAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Product analytics query error:", error);
    },
    // Add fallback data to prevent crashes
    placeholderData: [],
  });

  return {
    analyticsData: analyticsData || [],
    isLoading,
    error,
    refetch,
  };
};
