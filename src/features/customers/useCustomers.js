import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../../services/apiCustomer";

export function useCustomers() {
  const {
    data: customersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Customers query error:", error);
    },
    // Add fallback data to prevent crashes
    placeholderData: {
      data: {
        users: [],
      },
    },
  });

  return {
    customers: customersData?.data?.users || customersData?.data || [],
    isLoading,
    error,
    refetch,
  };
}
