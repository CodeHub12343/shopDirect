import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrder, deliverOrder } from "../../services/apiOrder";

export const useGetOrder = () => {
  const {
    data: Liveorders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  return { Liveorders, isLoading, error };
};

export const useGetOrderById = (orderId) => {
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
  return { order, isLoading, error };
};

// Mutation hook to mark delivered
export const useDeliverOrder = (orderId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deliverOrder(orderId),
    onSuccess: () => {
      // Refetch this order and the orders list
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
