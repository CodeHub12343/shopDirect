import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../services/apiProduct";

export const useGetProduct = (productId) => {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId, // Only run query if productId exists
  });

  return { product, isLoading, error };
};
