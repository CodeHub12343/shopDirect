import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "../../services/apiCustomer";

export function useCustomer(customerId) {
  const {
    data: customerData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId, // Only run query if customerId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Customer query error:", error);
    },
    // Add fallback data to prevent crashes
    placeholderData: {
      data: {
        user: null,
      },
    },
  });

  return {
    customer: customerData?.data?.user || customerData?.data || null,
    isLoading,
    error,
    refetch,
  };
}
