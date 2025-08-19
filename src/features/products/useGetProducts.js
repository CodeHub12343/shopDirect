import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/apiProduct";

export const useGetProducts = (page = 1, search = '', category = 'all', sort = 'name', limit = 10) => {
  const { data: liveProducts, isLoading, error } = useQuery({
    queryKey: ["products", page, search, category, sort, limit],
    queryFn: () => getProducts(page, search, category, sort, limit),
    keepPreviousData: true, // Keep previous data while loading new data
  });

  return { liveProducts, isLoading, error };
};

